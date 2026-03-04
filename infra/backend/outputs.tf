output "api_endpoint" {
  value       = aws_apigatewayv2_api.http.api_endpoint
  description = "Base API endpoint (https://...)"
}

output "api_domain" {
  value       = replace(aws_apigatewayv2_api.http.api_endpoint, "https://", "")
  description = "Origin domain for CloudFront (execute-api host)"
}

output "visit_url" {
  value       = "${aws_apigatewayv2_api.http.api_endpoint}/api/visit"
  description = "Direct visit endpoint"
}