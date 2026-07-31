# Claude AI Onboarding

A two-session course to get complete beginners comfortable with Claude.

- **Session 1** — the concepts. Models, terms, and the three files that shape how Claude behaves (`CLAUDE.md`, `SKILL.md`, `RULES.md`) — each with an example on disk and a plain-English reference.
- **Session 2** — the build. You end the session with a working AI agent you helped build, plus a hands-on hooks playground.

## Layout

```
sessions/
├── session-1-basics/
│   ├── README.md              ← concepts overview
│   ├── examples/              ← real CLAUDE.md, SKILL.md, RULES.md
│   └── reference/             ← explanation of each file
└── session-2-build/
    ├── README.md              ← 20-slide agenda
    ├── build-guide.md         ← the live-build steps
    ├── reference/             ← hooks + modes cheatsheets
    ├── research-agent/        ← starter project with TODOs
    └── hooks-playground/      ← runnable three-hook demo
```

## Quick tour

**Session 1, in one line:** "Here's Sonnet 5, here's a prompt, here's what a `CLAUDE.md` / `SKILL.md` / `RULES.md` looks like."

**Session 2, in one line:** "Open `hooks-playground/`, ask Claude to run `rm -rf /tmp/x`, watch a hook block it — then build the research agent."

## You need

- A Claude account.
- A terminal you're not scared of.
- One hour, twice.

## How to use this

1. Read `sessions/session-1-basics/README.md`. Skim the three examples in `examples/` and their matching references in `reference/`.
2. Clone this repo before Session 2. Open `sessions/session-2-build/README.md` and follow `build-guide.md` with the group.

That's it.
