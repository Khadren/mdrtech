############################################
# Core Project Configuration
############################################
variable "project_name" {
  description = "Short name used for tagging and resource naming"
  type        = string
}
############################################
# Domain Configuration
############################################
variable "hosted_zone_name" {
  type = string
}