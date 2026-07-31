# Reference — `CLAUDE.md`

## What it is

A plain markdown file that lives at the **root of a project**. Claude Code reads it automatically at the start of every session. Think of it as **passive project memory**: you write it once, and every new conversation already knows what the project is.

Analogy: it's the **employee handbook** you hand a new hire on day one — who they work for, what they should do, how they should behave, what's off-limits.

## Without vs. with

**Without a `CLAUDE.md`:** you retype the same context every session. "This is a support agent for Acme CRM, keep answers short, never guess account data…" — over and over. Different sessions drift. Different teammates get different behaviors.

**With a `CLAUDE.md`:** Claude opens the folder, reads the file, and instantly knows the project. Every session, every teammate — same context, same behavior.

## Where it lives

At the top of the project:

```
my-project/
├── CLAUDE.md          ← Claude reads this first
├── README.md
├── src/
└── …
```

You can also have **`CLAUDE.md` files inside subfolders** — Claude reads those too when it's working in that subfolder. Useful for large repos where different areas have different conventions.

## The shape

There's no rigid format, but this shape works well:

```markdown
# <Project name>

## What this project is
One or two sentences. What the project does, who it's for.

## My role
Who Claude is inside this project. "I am a support agent…", "I am a code
reviewer…", "I am a research assistant…".

## How I like to work
- Concrete preferences. "Short responses." "Confirm before making changes."
- One bullet per preference.

## What to avoid
- Concrete anti-patterns. "Never guess account data."
- One bullet per thing.
```

## Full example

See **`../examples/CLAUDE.md`** — a realistic example for a fictional Acme CRM support agent.

## Rules of thumb

- **Keep it short.** A page or two, tops. Long handbooks get skimmed.
- **Be specific.** "Be helpful" is useless. "Confirm before deleting data" is a real rule.
- **Update it when you notice drift.** If Claude keeps doing the wrong thing, tighten the file — don't retype the fix in the chat.
- **Personal notes go in `CLAUDE.local.md`.** Same folder, but git-ignored. Use it for private preferences you don't want to share with the team.

## What's next

`CLAUDE.md` sets the context. To shape *what Claude does* and *what Claude doesn't do*, you'll layer two more files on top:

- **`SKILL.md`** — specific capabilities. See `skills.md`.
- **`RULES.md`** — guardrails. See `rules.md`.

Together they form the base of what Session 2 calls the **Control Stack**.
