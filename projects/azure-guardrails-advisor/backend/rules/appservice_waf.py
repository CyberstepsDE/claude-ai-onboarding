from .base import Rule, RuleContext, Finding


class AppServicePublicWithoutWaf(Rule):
    rule_id = "APP-001"
    title = "App Service publicly reachable without a WAF in front"
    severity = "MEDIUM"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        # Heuristic: any App Service with a default hostname that is NOT restricted by IP
        # access restrictions and is not linked to an App Gateway/Front Door WAF policy.
        # A perfect answer needs Front Door/App Gateway lookups — this is a demo-grade check.
        kql = """
        Resources
        | where type =~ 'microsoft.web/sites'
        | where properties.publicNetworkAccess != 'Disabled'
        | extend ipRestrictions = properties.siteConfig.ipSecurityRestrictions
        | where array_length(ipRestrictions) <= 1  // default 'Allow all' rule
        | project id, type, name, location, defaultHostName = tostring(properties.defaultHostName)
        """
        return [
            self._finding(
                row,
                description=(
                    f"App Service '{row.get('name')}' ({row.get('defaultHostName')}) is publicly "
                    "reachable without IP restrictions or an apparent WAF policy."
                ),
                remediation=(
                    "Front the app with Application Gateway (WAF_v2) or Azure Front Door "
                    "Standard/Premium with WAF enabled, then restrict inbound access to that "
                    "service tag only."
                ),
            )
            for row in ctx.run_kql(kql)
        ]
