#!/usr/bin/env bash
# PreToolUse hook for the Bash tool.
#
# Blocks any command that looks destructive or privileged:
#   - rm -r / rm -rf         (recursive delete)
#   - sudo <anything>        (privilege escalation)
#   - curl ... | sh          (piping remote scripts straight into a shell)
#
# Exit 2 = block. The stderr message is fed back to Claude.

payload=$(cat)

if echo "$payload" | grep -qE 'rm[[:space:]]+-[rR][fF]?[[:space:]]'; then
  echo "Blocked by block-dangerous-bash: 'rm -r' / 'rm -rf' commands are not permitted in this project." >&2
  exit 2
fi

if echo "$payload" | grep -qE '(^|[[:space:]"])sudo[[:space:]]'; then
  echo "Blocked by block-dangerous-bash: 'sudo' commands are not permitted in this project." >&2
  exit 2
fi

if echo "$payload" | grep -qE 'curl[^|]*\|[[:space:]]*(sh|bash|zsh)'; then
  echo "Blocked by block-dangerous-bash: piping remote scripts into a shell (curl | sh) is not permitted." >&2
  exit 2
fi

exit 0
