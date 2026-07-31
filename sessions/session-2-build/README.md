# Session 2 — Build

The whole group builds a working research agent together. No traditional code — just editing plain-English files that Claude reads.

## What we build

A research agent that takes a real question, searches the web, reads what it finds, and returns a clean, cited answer.

**Example run.** You type: *"What are the latest AI safety papers?"*

The agent replies in the shape you defined in `SKILL.md`:
```
Question:  What are the latest AI safety papers?
Summary:   Two short sentences answering it.
Findings:  - Finding 1 [link]
           - Finding 2 [link]
Sources:   - https://…
           - https://…
```

## The 20-slide agenda

1. Title
2. 60-sec recap
3. What we're building
4. The Control Stack (CLAUDE.md → Skills → Rules → Hooks → Modes → Tools)
5. System prompt revisited
6. Skills — what & why
7. `SKILL.md` anatomy
8. **HANDS-ON: write a skill**
9. Rules — what & why
10. `RULES.md` anatomy
11. **HANDS-ON: write rules**
12. Modes (Shift+Tab: Plan / Default / Auto-accept)
13. Hooks
14. Tools & Agents (the loop)
15. Defining a tool + MCP
16. Prompt injection
17. 2026 case study
18. Evals
19. **LIVE BUILD**
20. Wrap + RAG teaser

## Folders

```
session-2-build/
  README.md          ← you are here
  build-guide.md     ← the step-by-step for the instructor
  reference/         ← cheatsheets: hooks.md, modes.md
  research-agent/    ← the live-build project (has TODOs)
  hooks-playground/  ← runnable demo of three hooks
```

Skills and Rules references live in Session 1 (`../session-1-basics/reference/skills.md` and `rules.md`). Learners should know the three-file base from Session 1 before touching this session.

## Start here

- Instructor: open `build-guide.md`.
- Learner in a hurry: `cd research-agent && claude`.
- Want to see hooks first: `cd hooks-playground && claude`.
