############################################
# Locals & Data
############################################
locals {
  root = var.hosted_zone_name
  www  = "www.${var.hosted_zone_name}"
}

data "aws_route53_zone" "primary" {
  name         = "${var.hosted_zone_name}."
  private_zone = false
}
############################################
# Route53
############################################
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.site_cert.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = data.aws_route53_zone.primary.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}


resource "aws_acm_certificate_validation" "site_cert" {
  provider                = aws.use1
  certificate_arn         = aws_acm_certificate.site_cert.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}
############################################
# ACM
############################################
resource "aws_acm_certificate" "site_cert" {
  provider          = aws.use1
  domain_name       = local.root
  validation_method = "DNS"

  subject_alternative_names = [local.www]

  lifecycle {
    create_before_destroy = true
  }
}