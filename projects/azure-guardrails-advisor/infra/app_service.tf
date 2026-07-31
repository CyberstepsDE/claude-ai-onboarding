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
  application_type    = "web"
  tags                = local.tags
}

resource "azurerm_service_plan" "web" {
  name                = "asp-${var.project}-${var.environment}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  os_type             = "Linux"
  sku_name            = "B1"
  tags                = local.tags
}

resource "azurerm_linux_web_app" "web" {
  name                = "app-${var.project}-${local.suffix}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  service_plan_id     = azurerm_service_plan.web.id

  https_only = true

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on           = true
    ftps_state          = "Disabled"
    http2_enabled       = true
    minimum_tls_version = "1.2"
    app_command_line    = "gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000"

    application_stack {
      python_version = "3.11"
    }
  }

  app_settings = {
    SUBSCRIPTION_ID                       = var.subscription_id
    FINDINGS_STORAGE_ACCOUNT              = azurerm_storage_account.findings.name
    FINDINGS_TABLE                        = azurerm_storage_table.findings.name
    SCAN_RUNS_TABLE                       = azurerm_storage_table.scan_runs.name
    SCM_DO_BUILD_DURING_DEPLOYMENT        = "true"
    ENABLE_ORYX_BUILD                     = "true"
    WEBSITES_PORT                         = "8000"
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.this.connection_string
  }

  tags = local.tags
}
