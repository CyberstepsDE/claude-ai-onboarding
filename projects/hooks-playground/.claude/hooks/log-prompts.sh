#!/usr/bin/env bash
# UserPromptSubmit hook.
#
# Appends every prompt the user sends to logs/prompts.log.
# This is the "logger" flavor of hook — it observes but does not block.

payload=$(cat)

# Pull the prompt out of the JSON payload with a plain regex (no jq).
prompt=$(echo "$payload" | sed -n 's/.*"prompt"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p' | head -1)

mkdir -p "$CLAUDE_PROJECT_DIR/logs"
timestamp=$(date -u +%FT%TZ)
echo "$timestamp | ${prompt:-<unparsed>}" >> "$CLAUDE_PROJECT_DIR/logs/prompts.log"

# Exit 0 = allow the prompt through. This hook only observes.
exit 0
