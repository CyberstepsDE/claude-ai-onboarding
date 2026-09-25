# Linux App Service running the Next.js app, with a System-Assigned identity,
# App Insights + Log Analytics wired in. Hardened defaults (https-only, TLS 1.2).

resource "azurerm_log_analytics_workspace" "this" {
  name                = "log-${var.project}-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

resource "azurerm_application_insights" "this" {
  name                = "appi-${var.project}-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  workspace_id        = azurerm_log_analytics_workspace.this.id
  application_type    = "Node.JS"
  tags                = local.tags
}

resource "azurerm_service_plan" "this" {
  name                = "asp-${var.project}-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  os_type             = "Linux"
  sku_name            = "B1"
  tags                = local.tags
}

resource "azurerm_linux_web_app" "this" {
  name                = "app-${var.project}-${local.suffix}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  service_plan_id     = azurerm_service_plan.this.id
  https_only          = true
  tags                = local.tags

  identity {
    type = "SystemAssigned"
  }

  site_config {
    ftps_state          = "Disabled"
    minimum_tls_version = "1.2"
    http2_enabled       = true
    always_on           = true

    # `next start` honors the PORT env var App Service injects, so we do NOT
    # set WEBSITES_PORT (that's for custom containers and would pin the gateway
    # to the wrong port).
    app_command_line = "npm run start"

    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    WEBSITE_NODE_DEFAULT_VERSION          = "~20"
    SCM_DO_BUILD_DURING_DEPLOYMENT        = "true"
    ENABLE_ORYX_BUILD                     = "true"
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.this.connection_string

    # App behavior. Keep mock unless you have wired Azure creds + Contributor.
    EXECUTOR_MODE          = var.executor_mode
    AZURE_SUBSCRIPTION_ID  = var.subscription_id
    AZURE_DEFAULT_LOCATION = var.location
  }
}

# When EXECUTOR_MODE=terraform, the app provisions VMs — its Managed Identity
# needs a write role. Contributor on the resource group is the minimum for a
# self-contained demo. (Kept here, commented, so mock deploys grant nothing.)
#
# resource "azurerm_role_assignment" "app_contributor" {
#   scope                = azurerm_resource_group.this.id
#   role_definition_name = "Contributor"
#   principal_id         = azurerm_linux_web_app.this.identity[0].principal_id
# }
