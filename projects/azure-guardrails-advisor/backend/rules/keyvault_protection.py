from .base import Rule, RuleContext, Finding


class KeyVaultPurgeProtection(Rule):
    rule_id = "KV-001"
    title = "Key Vault without purge protection"
    severity = "HIGH"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        kql = """
        Resources
        | where type =~ 'microsoft.keyvault/vaults'
        | where properties.enablePurgeProtection != true
        | project id, type, name, location, properties
        """
        return [
            self._finding(
                row,
                description=(
                    f"Key Vault '{row.get('name')}' does not have purge protection enabled. "
                    "Deleted secrets/keys can be permanently lost before the soft-delete window elapses."
                ),
                remediation="Set `purge_protection_enabled = true` on the azurerm_key_vault.",
            )
            for row in ctx.run_kql(kql)
        ]


class KeyVaultSoftDelete(Rule):
    rule_id = "KV-002"
    title = "Key Vault without soft delete"
    severity = "HIGH"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        kql = """
        Resources
        | where type =~ 'microsoft.keyvault/vaults'
        | where properties.enableSoftDelete != true
        | project id, type, name, location, properties
        """
        return [
            self._finding(
                row,
                description=(
                    f"Key Vault '{row.get('name')}' does not have soft delete enabled."
                ),
                remediation="Enable soft delete (default for new vaults; required for compliance).",
            )
            for row in ctx.run_kql(kql)
        ]
