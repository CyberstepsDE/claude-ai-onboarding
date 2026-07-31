# Research Agent

A small AI research assistant. You give it a question, it searches the web, reads what it finds, and returns a clean, structured summary with citations.

**Status:** starter — has TODOs completed live in Session 2.

## What controls this agent

Everything about how this agent behaves lives in four files. There is no traditional application code to change.

- **`CLAUDE.md`** — context and role. What the project is, what the agent is for. Claude reads this first.
- **`.claude/SKILL.md`** — behavior. Defines the `research_topic` skill: when to use it, how to behave, what the output should look like.
- **`.claude/RULES.md`** — guardrails. Scope, safety, and output constraints. What the agent must never do.
- **`src/agent.md`** — the loop. A plain-English walkthrough of the steps the agent takes when it runs.

## How to run this with Claude

You don't need to install anything special. Plain-language version:

1. Open this folder inside Claude Code (or in the Claude web app with the folder attached).
2. Claude will automatically read `CLAUDE.md`. It now knows what the project is.
3. Complete the TODOs in `.claude/SKILL.md`, `.claude/RULES.md`, and `src/agent.md`. (This is what happens live in Session 2.)
4. Ask a research question: e.g. *"What are the latest AI safety papers?"*
5. Watch the agent search, read, and respond in the format your skill defined.

That's it. If you want to change the behavior, edit the files. If something feels off, tighten a rule. If it can't do something, add a skill.
