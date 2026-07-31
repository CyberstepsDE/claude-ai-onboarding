"""Registry of all active rules.

Add a new rule by importing its class here and appending it to ALL_RULES.
"""

from .appservice_waf import AppServicePublicWithoutWaf
from .diagnostic_settings import MissingDiagnosticSettings
from .disk_encryption import UnencryptedManagedDisk
from .keyvault_protection import KeyVaultPurgeProtection, KeyVaultSoftDelete
from .nsg_open_ports import NsgOpenAdminPorts
from .private_endpoints import CosmosPublicAccess, SqlWithoutPrivateEndpoint
from .required_tags import MissingRequiredTags
from .storage_public import StoragePublicNetworkAccess, StorageWeakTls
from .vm_public_ip import VmWithPublicIp

ALL_RULES = [
    StoragePublicNetworkAccess,
    StorageWeakTls,
    KeyVaultPurgeProtection,
    KeyVaultSoftDelete,
    VmWithPublicIp,
    NsgOpenAdminPorts,
    UnencryptedManagedDisk,
    MissingDiagnosticSettings,
    SqlWithoutPrivateEndpoint,
    CosmosPublicAccess,
    MissingRequiredTags,
    AppServicePublicWithoutWaf,
]
