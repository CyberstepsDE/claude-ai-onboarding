#!/usr/bin/env bash
# PreToolUse hook: blocks any Bash command containing "rm -r" / "rm -rf".
#
# Claude Code pipes a JSON payload describing the tool call to this script
# on stdin. If we exit with code 2, Claude Code refuses the tool call and
# passes our stderr back to Claude so it knows why it was blocked.

payload=$(cat)

if echo "$payload" | grep -qE 'rm[[:space:]]+-[rR][fF]?'; then
  echo "Blocked by hook: 'rm -r' / 'rm -rf' commands are not permitted in this project. Ask the user before running destructive shell commands." >&2
  exit 2
fi

exit 0
