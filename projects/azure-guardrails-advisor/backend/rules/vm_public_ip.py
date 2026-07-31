from .base import Rule, RuleContext, Finding


class VmWithPublicIp(Rule):
    rule_id = "VM-001"
    title = "VM directly attached to a public IP"
    severity = "HIGH"

    def evaluate(self, ctx: RuleContext) -> list[Finding]:
        kql = """
        Resources
        | where type =~ 'microsoft.compute/virtualmachines'
        | extend nicIds = properties.networkProfile.networkInterfaces
        | mv-expand nic = nicIds
        | extend nicId = tostring(nic.id)
        | join kind=leftouter (
            Resources
            | where type =~ 'microsoft.network/networkinterfaces'
            | mv-expand ipconfig = properties.ipConfigurations
            | extend pipId = tostring(ipconfig.properties.publicIPAddress.id)
            | where isnotempty(pipId)
            | project nicId = id, pipId
        ) on nicId
        | where isnotempty(pipId)
        | project id, type, name, location, pipId
        """
        return [
            self._finding(
                row,
                description=(
                    f"VM '{row.get('name')}' has a public IP directly attached via a NIC. "
                    "Direct exposure increases attack surface."
                ),
                remediation=(
                    "Front the VM with an Azure Load Balancer or Application Gateway, or use "
                    "Azure Bastion for administrative access. Remove the public IP association."
                ),
                public_ip_id=row.get("pipId"),
            )
            for row in ctx.run_kql(kql)
        ]
