# Research Agent

A tiny AI agent that searches the web, reads what it finds, and returns a cited summary.

**Status:** starter — has TODOs you'll complete in Session 2.

## What controls it

```
research-agent/
├── CLAUDE.md          ← context: who this agent is
├── .claude/
│   ├── SKILL.md       ← behavior: what it does (has TODOs)
│   └── RULES.md       ← guardrails: what it never does (has TODOs)
└── src/
    └── agent.md       ← the loop, in plain English (has one TODO)
```

## Example — the finished output

Ask: *"What are the latest AI safety papers?"*

Get back (once you've filled in `SKILL.md`):

```
Question:  What are the latest AI safety papers?
Summary:   Recent work focuses on X and Y…
Findings:
  - Paper A shows … [https://arxiv.org/abs/…]
  - Paper B argues … [https://arxiv.org/abs/…]
Sources:
  - https://arxiv.org/abs/…
  - https://arxiv.org/abs/…
```

## Run it

```
cd sessions/session-2-build/research-agent
claude
```

Then fill in the TODOs in `.claude/SKILL.md`, `.claude/RULES.md`, and `src/agent.md`. Ask a research question. Watch it work.
