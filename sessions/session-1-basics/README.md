# Session 1 — Concepts

The words and files you need to understand before Session 2 gets hands-on.

## What's in this folder

```
session-1-basics/
├── README.md          ← you are here (the concept overview)
├── examples/          ← real files, ready to look at
│   ├── CLAUDE.md
│   ├── SKILL.md
│   └── RULES.md
└── reference/         ← plain-English explanation of each file above
    ├── claude-md.md
    ├── skills.md
    └── rules.md
```

**How to use the two folders together:** open the `examples/` file for the *shape*, open the matching `reference/` doc for the *why*.

## 1. Which Claude model?

| Model | When to pick it |
|---|---|
| **Haiku 4.5** | Fast, cheap. Bulk work — tag 10,000 tickets overnight. |
| **Sonnet 5** | The default. Start here. |
| **Opus 4.8** | Hard reasoning, deep research. |
| **Fable 5** | Top tier. When cost doesn't matter. |

**Rule of thumb: start with Sonnet.**

> The lineup changes every few months. Confirm at **anthropic.com/pricing** before teaching.

## 2. Vocabulary

| Word | What it means |
|---|---|
| **Prompt** | What you send Claude. |
| **Token** | ~3–4 characters. You pay per token. |
| **Context window** | How much text Claude can see at once. |
| **Temperature** | Low = predictable. High = creative. |

**Example:** *"Summarize this doc."* is ~4 tokens. A 10-page PDF is ~5,000 tokens. Both fit in the context window with room to spare.

## 3. Rate limits (RPM / TPM / TPD)

You get so many **R**equests **P**er **M**inute, **T**okens **P**er **M**inute, and **T**okens **P**er **D**ay. Exceed them and you get **HTTP 429**.

**Fix:** wait, batch, or drop to a smaller model. Not "retry harder."

## 4. Claude Code vs. Cowork

- **Claude Code** — terminal / IDE. Files on your laptop.
- **Cowork** — browser. Hosted environment.

Same model. Different door.

## 5. The three files that shape Claude's behavior

Almost everything about how a Claude project behaves is controlled by three plain-markdown files. Learn these three and you can read most Claude projects in the wild.

### `CLAUDE.md` — context

The employee handbook. Who Claude is on this project, how it should work, what to avoid. Claude reads it at the start of every session.

- **Example:** `examples/CLAUDE.md`
- **Reference:** `reference/claude-md.md`

### `SKILL.md` — capabilities

What Claude *can* do. Each skill describes a specific behavior: when to use it, how it should work, what the output should look like.

- **Example:** `examples/SKILL.md`
- **Reference:** `reference/skills.md`

### `RULES.md` — guardrails

What Claude *cannot* do. Scope, safety, output constraints, tone.

- **Example:** `examples/RULES.md`
- **Reference:** `reference/rules.md`

**One-liner to memorize:** *Skills unlock behavior. Rules constrain it. `CLAUDE.md` gives them both context.*

## Coming in Session 2 (just the names)

**Hooks · Modes · Tools & Agents · Prompt-injection safety · Evals**

Session 2 layers these on top of the three files above and walks the group through a live build.
