from .base import Rule, RuleContext, Finding


class MissingDiagnosticSettings(Rule):
    rule_id = "DIAG-001"
    title = "Resource missing diagnostic settings"
    severity = "MEDIUM"

    # Types where the absence of diagnostic settings is most impactful for security investigations.
    TARGET_TYPES = [
        "microsoft.keyvault/vaults",
        "microsoft.storage/storageaccounts",
        "microsoft.network/networksecuritygroups",
        "microsoft.sql/servers",
    ]

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        types_filter = ", ".join(f"'{t}'" for t in self.TARGET_TYPES)
        kql = f"""
        Resources
        | where tolower(type) in ({types_filter})
        | project id, type, name, location
        | join kind=leftouter (
            Resources
            | where type =~ 'microsoft.insights/diagnosticsettings'
            | extend parentId = tolower(tostring(properties.targetResourceId))
            | project parentId, diagSettingId = id
        ) on $left.id == $right.parentId
        | where isempty(diagSettingId)
        | project id, type, name, location
        """
        return [
            self._finding(
                row,
                description=(
                    f"{row.get('type')} '{row.get('name')}' has no diagnostic settings. "
                    "Security investigations will be missing critical audit data."
                ),
                remediation=(
                    "Attach a diagnostic setting routing logs to a Log Analytics workspace. "
                    "In Terraform: azurerm_monitor_diagnostic_setting."
                ),
            )
            for row in ctx.run_kql(kql)
        ]
