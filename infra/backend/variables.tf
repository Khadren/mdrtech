############################################
# Core Project Configuration
############################################

variable "project_name" {
  type        = string
  description = "Short project name prefix"
}

variable "region" {
  type        = string
  description = "AWS region for backend resources"
}
############################################
# API Configuration
############################################
variable "cors_allow_origins" {
  type        = list(string)
  description = "CORS allow-origins for API Gateway (site URLs)"
  default = [
    "https://mdrtech.ca",
    "https://www.mdrtech.ca"
  ]
}
############################################
# Alerting & Notifications
############################################
variable "alert_email" {
  type        = string
  description = "Email for alarm notifications and visit notifications"
  default     = null

  validation {
    condition     = var.alert_email == null || can(regex("^.+@.+\\..+$", var.alert_email))
    error_message = "alert_email must be a valid email address or null."
  }
}
