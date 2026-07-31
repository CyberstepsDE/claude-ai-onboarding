output "resource_group" {
  value = azurerm_resource_group.this.name
}

output "web_app_name" {
  value = azurerm_linux_web_app.web.name
}

output "site_url" {
  value = "https://${azurerm_linux_web_app.web.default_hostname}"
}

output "findings_storage_account" {
  value = azurerm_storage_account.findings.name
}
