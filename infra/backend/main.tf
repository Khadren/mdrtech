############################################
# Locals
############################################
locals {
  name        = var.project_name
  lambda_name = "${var.project_name}-visit-notify"
  apigw_name  = "${var.project_name}-http-api"
}
############################################
# Log groups
############################################
resource "aws_cloudwatch_log_group" "apigw" {
  name              = "/aws/apigw/${local.apigw_name}"
  retention_in_days = 3
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${local.lambda_name}"
  retention_in_days = 3
}
############################################
# IAM
############################################
resource "aws_iam_role" "lambda_role" {
  name               = "${local.name}-visit-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.visits.arn]
  }

  statement {
    actions = ["logs:CreateLogStream", "logs:PutLogEvents", "logs:DescribeLogStreams"]
    resources = [
      "${aws_cloudwatch_log_group.lambda.arn}:*"
    ]
  }
}

resource "aws_iam_role_policy" "lambda_inline" {
  name   = "${local.name}-visit-lambda-policy"
  role   = aws_iam_role.lambda_role.id
  policy = data.aws_iam_policy_document.lambda_policy.json
}
############################################
# Lambda
############################################
resource "aws_lambda_function" "visit" {
  function_name = local.lambda_name
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  depends_on    = [aws_cloudwatch_log_group.lambda]

  filename         = "${path.module}/build/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/build/lambda.zip")

  architectures                  = ["arm64"]
  memory_size                    = 256
  timeout                        = 5
  reserved_concurrent_executions = 10

  environment {
    variables = {
      VISIT_TOPIC_ARN = aws_sns_topic.visits.arn
    }
  }
}
############################################
# API
############################################
resource "aws_apigatewayv2_api" "http" {
  name          = local.apigw_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.cors_allow_origins
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type", "authorization", "x-requested-with"]
    max_age       = 86400
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.visit.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "visit" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /api/visit"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "visit_post" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /api/visit"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true

  # Access log format intentionally omits source IP. Visit notifications
  # are handled by the Lambda; access logs are kept short and minimal for
  # debugging only.
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.apigw.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      errorMessage   = "$context.error.message"
    })
  }
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.visit.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}
############################################
# SNS Topics
############################################
# Operational alarms — pages me when something is broken.
resource "aws_sns_topic" "alerts" {
  name = "${local.name}-alerts"
}

resource "aws_sns_topic_subscription" "alerts_email" {
  count     = var.alert_email == null ? 0 : 1
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# Visit notifications — emails me when someone hits the site, with the
# CloudFront-derived approximate location. Separate topic so visit pings
# never get mixed up with real operational alerts.
resource "aws_sns_topic" "visits" {
  name = "${local.name}-visits"
}

resource "aws_sns_topic_subscription" "visits_email" {
  count     = var.alert_email == null ? 0 : 1
  topic_arn = aws_sns_topic.visits.arn
  protocol  = "email"
  endpoint  = var.alert_email
}
############################################
# Alarms
############################################
# Lambda Errors
# notBreaching keeps quiet periods OK instead of INSUFFICIENT_DATA, so
# we don't get spurious "back to OK" emails every time traffic resumes.
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${local.name}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 0
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.visit.function_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# Lambda Throttles
resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {
  alarm_name          = "${local.name}-lambda-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 0
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.visit.function_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# Lambda Duration
resource "aws_cloudwatch_metric_alarm" "lambda_duration_p95" {
  alarm_name          = "${local.name}-lambda-duration-p95"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 60
  extended_statistic  = "p95"
  threshold           = 1000 # ms
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.visit.function_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# API Gateway 5XX Errors
resource "aws_cloudwatch_metric_alarm" "apigw_5xx" {
  alarm_name          = "${local.name}-apigw-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = 1
  metric_name         = "5xx"
  namespace           = "AWS/ApiGateway"
  period              = 60
  statistic           = "Sum"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = aws_apigatewayv2_api.http.id
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}
############################################
# CloudWatch Dashboard (Ops Signal)
############################################
resource "aws_cloudwatch_dashboard" "ops" {
  dashboard_name = "${local.name}-ops"

  dashboard_body = jsonencode({
    widgets = [
      # ----------------------------
      # Lambda
      # ----------------------------
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "Lambda - Invocations / Errors / Throttles"
          region = var.region
          stat   = "Sum"
          period = 60
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", aws_lambda_function.visit.function_name],
            [".", "Errors", ".", "."],
            [".", "Throttles", ".", "."]
          ]
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "Lambda - Duration (p95)"
          region = var.region
          period = 60
          stat   = "p95"
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", aws_lambda_function.visit.function_name]
          ]
        }
      },

      # ----------------------------
      # API Gateway
      # ----------------------------
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "HTTP API - Requests / 4XX / 5XX"
          region = var.region
          stat   = "Sum"
          period = 60
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiId", aws_apigatewayv2_api.http.id, "Stage", aws_apigatewayv2_stage.default.name],
            [".", "4XXError", ".", ".", ".", "."],
            [".", "5XXError", ".", ".", ".", "."]
          ]
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "HTTP API - Latency (p95) / IntegrationLatency (p95)"
          region = var.region
          stat   = "p95"
          period = 60
          metrics = [
            ["AWS/ApiGateway", "Latency", "ApiId", aws_apigatewayv2_api.http.id, "Stage", aws_apigatewayv2_stage.default.name],
            [".", "IntegrationLatency", ".", ".", ".", "."]
          ]
        }
      },

      # ----------------------------
      # SNS (visit notifications & alerts)
      # ----------------------------
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 24
        height = 6
        properties = {
          title  = "SNS - Messages Published"
          region = var.region
          stat   = "Sum"
          period = 300
          metrics = [
            ["AWS/SNS", "NumberOfMessagesPublished", "TopicName", aws_sns_topic.visits.name],
            [".", ".", ".", aws_sns_topic.alerts.name]
          ]
        }
      }
    ]
  })
}
