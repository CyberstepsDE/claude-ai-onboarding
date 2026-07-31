from .base import Rule, RuleContext, Finding


class SqlWithoutPrivateEndpoint(Rule):
    rule_id = "PE-001"
    title = "SQL server publicly reachable (no private endpoint or public access enabled)"
    severity = "HIGH"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        kql = """
        Resources
        | where type =~ 'microsoft.sql/servers'
        | where properties.publicNetworkAccess != 'Disabled'
        | project id, type, name, location, properties
        """
        return [
            self._finding(
                row,
                description=(
                    f"SQL server '{row.get('name')}' has public network access enabled. "
                    "Prefer routing traffic exclusively through a private endpoint."
                ),
                remediation=(
                    "Set `public_network_access_enabled = false` on azurerm_mssql_server and "
                    "add an azurerm_private_endpoint targeting sqlServer."
                ),
            )
            for row in ctx.run_kql(kql)
        ]


class CosmosPublicAccess(Rule):
    rule_id = "PE-002"
    title = "Cosmos DB account has public network access enabled"
    severity = "HIGH"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        kql = """
        Resources
        | where type =~ 'microsoft.documentdb/databaseaccounts'
        | where properties.publicNetworkAccess != 'Disabled'
        | project id, type, name, location, properties
        """
        return [
            self._finding(
                row,
                description=(
                    f"Cosmos DB account '{row.get('name')}' allows public network access."
                ),
                remediation=(
                    "Disable `public_network_access_enabled` on the azurerm_cosmosdb_account "
                    "and add a private endpoint."
                ),
            )
            for row in ctx.run_kql(kql)
        ]
