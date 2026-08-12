output "resource_group_name" {
  value = azurerm_resource_group.this.name
}

output "static_web_app_name" {
  value = azurerm_static_web_app.this.name
}

output "default_host_name" {
  description = "Public URL of the deployed site (available after content upload)."
  value       = "https://${azurerm_static_web_app.this.default_host_name}"
}

output "deployment_token" {
  description = "Token used by the SWA CLI (`swa deploy`) to upload the built dist/ folder."
  value       = azurerm_static_web_app.this.api_key
  sensitive   = true
}
