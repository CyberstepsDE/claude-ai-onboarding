# Reference — Skills

## What a Skill is

A **Skill** is a specific capability you're giving Claude: what it can do, when to do it, and how the output should look. Each skill is one file with three short sections.

Skills are how you turn a general-purpose model into something focused. Instead of hoping Claude will "just summarize well," you write down exactly what a good summary looks like — and every response follows that shape.

## Without vs. with

**Without a skill:** you type "summarize this document." Claude gives you a paragraph. Next time you ask, you get a different shape. Your teammate asks and gets a third shape. Nothing is consistent, nothing is repeatable.

**With a skill:** you type "summarize this document." Claude knows the skill named `summarize_document`, applies its behavior list, and returns output in the exact format you defined. Every time. Every teammate. Every doc.

## Where a Skill lives

Skills live at `.claude/SKILL.md` at the root of the project. Claude Code discovers them automatically. Larger projects can have multiple skill files.

## The three sections

Every SKILL.md follows the same shape:

1. **When to use.** The trigger. In what situations should Claude reach for this skill? Be specific.
2. **Behavior.** The steps. A numbered list of what Claude should do when the skill runs.
3. **Output format.** The shape. Exactly how the response should be structured — sections, bullets, fields.

## Full example

See **`../examples/SKILL.md`** for a complete `summarize_document` skill you can read on disk. Here's a compressed peek:

```markdown
# Skill: summarize_document

## When to use
When a user pastes a long doc and asks for a shorter version.

## Behavior
1. Read the full document.
2. Extract the 3 most important key points.
3. Find any action items — do not invent them.

## Output format
**Summary** — 2–3 sentences.
**Key Points** — 3 bullets.
**Action Items** — one line each, or "No action items."
```

## When to write a new skill

Anytime you catch yourself pasting the same instructions into Claude for the third time. That's the signal — take those instructions, drop them in a `SKILL.md`, and stop retyping them.
