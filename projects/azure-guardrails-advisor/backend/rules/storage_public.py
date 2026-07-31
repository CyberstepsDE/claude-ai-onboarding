from .base import Rule, RuleContext, Finding


class StoragePublicNetworkAccess(Rule):
    rule_id = "STORAGE-001"
    title = "Storage account allows public network access"
    severity = "HIGH"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        kql = """
        Resources
        | where type =~ 'microsoft.storage/storageaccounts'
        | where properties.publicNetworkAccess != 'Disabled'
        | project id, type, name, location, properties
        """
        return [
            self._finding(
                row,
                description=(
                    f"Storage account '{row.get('name')}' has publicNetworkAccess = "
                    f"'{row.get('properties', {}).get('publicNetworkAccess', 'Enabled')}'. "
                    "This exposes it to the public internet."
                ),
                remediation=(
                    "Set publicNetworkAccess to 'Disabled' and expose the account via "
                    "a Private Endpoint. In Terraform: "
                    "`public_network_access_enabled = false` on the azurerm_storage_account."
                ),
            )
            for row in ctx.run_kql(kql)
        ]


class StorageWeakTls(Rule):
    rule_id = "STORAGE-002"
    title = "Storage account allows TLS < 1.2"
    severity = "MEDIUM"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        kql = """
        Resources
        | where type =~ 'microsoft.storage/storageaccounts'
        | where properties.minimumTlsVersion != 'TLS1_2'
        | project id, type, name, location, properties
        """
        return [
            self._finding(
                row,
                description=(
                    f"Storage account '{row.get('name')}' minimum TLS version is "
                    f"'{row.get('properties', {}).get('minimumTlsVersion', 'unknown')}'."
                ),
                remediation="Set `min_tls_version = \"TLS1_2\"` on the storage account.",
            )
            for row in ctx.run_kql(kql)
        ]
