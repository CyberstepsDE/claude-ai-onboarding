# Azure Static Web App hosts the built Vite bundle.
# We deploy via the SWA CLI using the `api_key` output below,
# rather than wiring up a GitHub Actions repo — keeps the demo self-contained.

resource "azurerm_static_web_app" "this" {
  name                = "swa-${var.project}-${var.environment}-${local.suffix}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location

  sku_tier = var.sku_tier
  sku_size = var.sku_tier

  tags = local.tags
}
