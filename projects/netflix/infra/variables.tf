variable "subscription_id" {
  description = "Azure subscription ID to deploy the mock Netflix demo into."
  type        = string
  default     = "c3dc5e7c-cd4d-46b0-b7d8-efd2e3dde06e"
}

variable "project" {
  description = "Short project slug used to name resources."
  type        = string
  default     = "netflix"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for the Static Web App. Free tier is available in a limited set of regions."
  type        = string
  default     = "westeurope"
}

variable "sku_tier" {
  description = "Static Web App SKU. 'Free' for demos; 'Standard' for custom domains/auth."
  type        = string
  default     = "Free"
  validation {
    condition     = contains(["Free", "Standard"], var.sku_tier)
    error_message = "sku_tier must be either 'Free' or 'Standard'."
  }
}
