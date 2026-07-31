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

## Full example: `summarize_document`

```markdown
# Skill: summarize_document

## When to use

Use this skill when a customer sends in a long document — a policy PDF, an
exported email thread, a knowledge-base article — and asks for a shorter
version. Also use it when an internal teammate pastes a wall of text and asks
"what does this say?"

## Behavior

1. **Read the full document.** Do not skim. Cover it start to end so nothing
   important is missed.
2. **Extract the 3 most important key points.** Focus on what the reader
   actually needs to know, not what is merely present in the text.
3. **Find any action items.** These are sentences that describe something
   someone must do, decide, or follow up on. If there are none, say so — do
   not invent them.

## Output format

**Summary**
One short paragraph (2–3 sentences) capturing the document's overall point.

**Key Points**
- Point 1
- Point 2
- Point 3

**Action Items**
- Who / What / When (one line each). If there are none, write: "No action items."
```

## When to write a new skill

Anytime you catch yourself pasting the same instructions into Claude for the third time. That's the signal — take those instructions, drop them in a `SKILL.md`, and stop retyping them.
