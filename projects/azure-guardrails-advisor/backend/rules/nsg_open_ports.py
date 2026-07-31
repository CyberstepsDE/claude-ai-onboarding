from .base import Rule, RuleContext, Finding


class NsgOpenAdminPorts(Rule):
    rule_id = "NSG-001"
    title = "NSG allows 0.0.0.0/0 on SSH (22) or RDP (3389)"
    severity = "HIGH"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        kql = """
        Resources
        | where type =~ 'microsoft.network/networksecuritygroups'
        | mv-expand rule = properties.securityRules
        | extend
            direction = tostring(rule.properties.direction),
            access = tostring(rule.properties.access),
            protocol = tostring(rule.properties.protocol),
            src = tostring(rule.properties.sourceAddressPrefix),
            dstPort = tostring(rule.properties.destinationPortRange)
        | where direction == 'Inbound' and access == 'Allow'
        | where src in ('*', '0.0.0.0/0', 'Internet')
        | where dstPort in ('22', '3389') or dstPort contains '22' or dstPort contains '3389'
        | project id, type, name, location, ruleName = tostring(rule.name), dstPort, src
        """
        return [
            self._finding(
                row,
                description=(
                    f"NSG '{row.get('name')}' rule '{row.get('ruleName')}' allows inbound "
                    f"traffic from '{row.get('src')}' to port {row.get('dstPort')}. "
                    "Admin ports should never be open to the internet."
                ),
                remediation=(
                    "Restrict the source to a specific IP range or move to Azure Bastion. "
                    "In Terraform, tighten the `source_address_prefix` on the "
                    "azurerm_network_security_rule."
                ),
                rule_name=row.get("ruleName"),
                port=row.get("dstPort"),
            )
            for row in ctx.run_kql(kql)
        ]
