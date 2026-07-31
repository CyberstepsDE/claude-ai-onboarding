resource "azurerm_storage_account" "findings" {
  name                     = "st${var.project}${local.suffix}"
  resource_group_name      = azurerm_resource_group.this.name
  location                 = azurerm_resource_group.this.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  min_tls_version                 = "TLS1_2"
  https_traffic_only_enabled      = true
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = true

  tags = local.tags
}

resource "azurerm_storage_table" "findings" {
  name                 = "findings"
  storage_account_name = azurerm_storage_account.findings.name
}

resource "azurerm_storage_table" "scan_runs" {
  name                 = "scanruns"
  storage_account_name = azurerm_storage_account.findings.name
}
