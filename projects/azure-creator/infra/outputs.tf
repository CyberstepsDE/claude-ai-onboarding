output "resource_group" {
  value       = azurerm_resource_group.this.name
  description = "Resource group holding the app."
}

output "app_name" {
  value       = azurerm_linux_web_app.this.name
  description = "App Service name."
}

output "app_url" {
  value       = "https://${azurerm_linux_web_app.this.default_hostname}"
  description = "Public URL of the deployed app."
}

output "app_principal_id" {
  value       = azurerm_linux_web_app.this.identity[0].principal_id
  description = "Managed Identity principal ID (grant it Contributor for live mode)."
}
