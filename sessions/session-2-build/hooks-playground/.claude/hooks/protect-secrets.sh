#!/usr/bin/env bash
# PreToolUse hook for Read / Edit / Write.
#
# Refuses to touch any file whose path looks like a secret:
#   - anything under a "secrets/" folder
#   - .env files
#   - common private-key filenames (id_rsa, id_ed25519)
#
# We just grep the raw payload — enough for a demo without needing jq.

payload=$(cat)

if echo "$payload" | grep -qE 'secrets/|\.env(\.|"|/)|/id_rsa|/id_ed25519'; then
  echo "Blocked by protect-secrets: this file path looks like a secret. This project keeps 'secrets/' and '.env' files off-limits to the agent." >&2
  exit 2
fi

exit 0
