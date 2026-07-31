from .base import Rule, RuleContext, Finding


class UnencryptedManagedDisk(Rule):
    rule_id = "DISK-001"
    title = "Managed disk without customer-controlled encryption"
    severity = "MEDIUM"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        # All Azure managed disks are encrypted at rest by default with platform-managed keys.
        # This rule flags disks that are NOT using a customer-managed key (CMK) or double
        # encryption, which higher-compliance environments typically require.
        kql = """
        Resources
        | where type =~ 'microsoft.compute/disks'
        | extend encryptionType = tostring(properties.encryption.type)
        | where encryptionType == '' or encryptionType == 'EncryptionAtRestWithPlatformKey'
        | project id, type, name, location, encryptionType
        """
        return [
            self._finding(
                row,
                description=(
                    f"Disk '{row.get('name')}' uses encryption type "
                    f"'{row.get('encryptionType') or 'default (platform-managed key)'}'. "
                    "Compliance frameworks (PCI, ISO 27001, some internal policies) require CMK."
                ),
                remediation=(
                    "Attach a disk encryption set backed by a Key Vault key. In Terraform, set "
                    "`disk_encryption_set_id` on azurerm_managed_disk."
                ),
            )
            for row in ctx.run_kql(kql)
        ]
