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
# DynamoDB Tables
############################################
variable "visit_table_name" {
  type        = string
  description = "DynamoDB table for visit counts"
  default     = null
}

variable "seen_table_name" {
  type        = string
  description = "DynamoDB table for visits seen"
  default     = null
}

variable "counter_key" {
  type        = string
  description = "Partition key value for the singleton counter item"
  default     = "site"
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
# Alerting
############################################
variable "alert_email" {
  type        = string
  description = "Email for alarm notifications"
  default     = null

  validation {
    condition     = var.alert_email == null || can(regex("^.+@.+\\..+$", var.alert_email))
    error_message = "alert_email must be a valid email address or null."
  }
}