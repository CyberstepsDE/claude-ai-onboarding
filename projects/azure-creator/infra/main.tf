# ============================================================
# azure-creator — app hosting infrastructure
# Deploys THIS app (the VM Launcher) to Azure App Service.
# Credentials-ready; not applied by default. Local state.
# ============================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {}
}

locals {
  # Short deterministic suffix for globally-unique names (same trick used
  # across this repo's other infra/ modules).
  suffix = substr(sha1("${var.subscription_id}-${var.project}-${var.environment}"), 0, 6)

  tags = {
    project     = var.project
    environment = var.environment
    managed_by  = "terraform"
  }
}

resource "azurerm_resource_group" "this" {
  name     = "rg-${var.project}-${var.environment}"
  location = var.location
  tags     = local.tags
}
