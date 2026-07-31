"""Base classes for the rule engine.

A `Rule` inspects the subscription (usually via a KQL query through the Resource
Graph client passed on the `RuleContext`) and returns zero or more `Finding`s.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Literal

Severity = Literal["HIGH", "MEDIUM", "LOW"]


@dataclass
class Finding:
    rule_id: str
    title: str
    severity: Severity
    resource_id: str
    resource_type: str
    location: str
    description: str
    remediation: str
    metadata: dict = field(default_factory=dict)


@dataclass
class RuleContext:
    subscription_id: str
    credential: object  # DefaultAzureCredential — kept as `object` to avoid a hard SDK import here
    run_kql: Callable[[str], list[dict]]


class Rule:
    """Subclass and set `rule_id`, `title`, `severity`, then implement `evaluate`."""

    rule_id: str = ""
    title: str = ""
    severity: Severity = "MEDIUM"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:  # pragma: no cover — abstract
        raise NotImplementedError

    def _finding(self, row: dict, description: str, remediation: str, **metadata) -> Finding:
        """Helper: build a Finding from a Resource Graph row."""
        return Finding(
            rule_id=self.rule_id,
            title=self.title,
            severity=self.severity,
            resource_id=row.get("id", ""),
            resource_type=row.get("type", ""),
            location=row.get("location", ""),
            description=description,
            remediation=remediation,
            metadata=metadata,
        )
