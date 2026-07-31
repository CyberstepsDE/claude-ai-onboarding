variable "subscription_id" {
  description = "Azure subscription ID to deploy into and scan."
  type        = string
  default     = "c3dc5e7c-cd4d-46b0-b7d8-efd2e3dde06e"
}

variable "project" {
  description = "Short project slug used to name resources."
  type        = string
  default     = "guardrails"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for all resources."
  type        = string
  default     = "westeurope"
}
