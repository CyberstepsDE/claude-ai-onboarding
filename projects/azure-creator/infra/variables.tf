variable "subscription_id" {
  type        = string
  description = "Azure subscription ID to deploy the app into."
}

variable "project" {
  type        = string
  description = "Project name, used as a naming prefix."
  default     = "azure-creator"
}

variable "environment" {
  type        = string
  description = "Environment name (dev/test/prod)."
  default     = "dev"
}

variable "location" {
  type        = string
  description = "Azure region for the app."
  default     = "westeurope"
}

variable "executor_mode" {
  type        = string
  description = "EXECUTOR_MODE app setting: 'mock' (default) or 'terraform'."
  default     = "mock"

  validation {
    condition     = contains(["mock", "terraform"], var.executor_mode)
    error_message = "executor_mode must be either 'mock' or 'terraform'."
  }
}
