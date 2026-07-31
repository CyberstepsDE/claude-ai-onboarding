from .base import Rule, RuleContext, Finding


class MissingRequiredTags(Rule):
    rule_id = "TAG-001"
    title = "Resource missing one or more required tags"
    severity = "LOW"

    REQUIRED = ("owner", "env", "costcenter")

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        required_check = " or ".join(
            f"isempty(tostring(tags['{tag}']))" for tag in self.REQUIRED
        )
        kql = f"""
        Resources
        | where type !startswith 'microsoft.resources/'
        | where {required_check}
        | project id, type, name, location, tags
        | limit 500
        """
        return [
            self._finding(
                row,
                description=(
                    f"'{row.get('name')}' is missing one of the required tags "
                    f"({', '.join(self.REQUIRED)}). Present tags: {row.get('tags') or {}}."
                ),
                remediation=(
                    "Add the missing tags via Terraform or an Azure Policy that appends them "
                    "at create time."
                ),
                present_tags=row.get("tags") or {},
            )
            for row in ctx.run_kql(kql)
        ]
