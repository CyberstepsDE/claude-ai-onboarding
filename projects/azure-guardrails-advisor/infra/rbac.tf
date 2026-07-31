data "azurerm_subscription" "current" {
  subscription_id = var.subscription_id
}

resource "azurerm_role_assignment" "reader" {
  scope                = data.azurerm_subscription.current.id
  role_definition_name = "Reader"
  principal_id         = azurerm_linux_web_app.web.identity[0].principal_id
}

resource "azurerm_role_assignment" "security_reader" {
  scope                = data.azurerm_subscription.current.id
  role_definition_name = "Security Reader"
  principal_id         = azurerm_linux_web_app.web.identity[0].principal_id
}

resource "azurerm_role_assignment" "findings_writer" {
  scope                = azurerm_storage_account.findings.id
  role_definition_name = "Storage Table Data Contributor"
  principal_id         = azurerm_linux_web_app.web.identity[0].principal_id
}
