# Session 2 — Now We Build Something Real, Together

Session 1 was concepts. This session is hands. The whole group sits down with Claude and builds a working **Research Agent** — something that takes a real question, searches the web, reads what it finds, and returns a clean, structured answer.

We build it by editing a `SKILL.md` and a `RULES.md`. No traditional code. That's the point: you'll see how much of a capable AI system is shaped just by writing clear instructions.

## The 20-slide flow (session agenda)

1. **Title** — welcome and framing.
2. **60-second recap** of Session 1.
3. **What we're building** — one screenshot of the finished research agent.
4. **The Control Stack** — mental model: `CLAUDE.md` → Skills → Rules → Hooks → Modes → Tools.
5. **System prompt revisited** — from "concept" (Session 1) to "how you actually write one."
6. **Skills — what & why.**
7. **`SKILL.md` anatomy** — When to use / Behavior / Output format.
8. **HANDS-ON: write a skill.** Fill in `research_topic` in `.claude/SKILL.md`.
9. **Rules — what & why.**
10. **`RULES.md` anatomy** — Scope / Output / Safety / Tone.
11. **HANDS-ON: write rules.** Fill in the TODOs in `.claude/RULES.md`.
12. **Claude Code Modes** — Plan, Default, Auto-accept edits. Shift+Tab cycles them.
13. **Hooks** — automatic before/after checkpoints.
14. **Tools & Agents** — the loop that turns a chatbot into an agent.
15. **Defining a tool** + a short mention of **MCP** (Model Context Protocol) as the standard way to share tools between apps.
16. **Prompt injection** — what it is, why it's dangerous, how the rules we just wrote defend against it.
17. **2026 case study** — a real-world AI incident, discussed as a group.
18. **Evals** — how you know your agent actually works.
19. **LIVE BUILD** — run the agent on a real question, then try to break it.
20. **Wrap + what's next** — a one-slide teaser on **RAG** (retrieval-augmented generation) as the natural next step.

## Where to go

- **`build-guide.md`** — the step-by-step for the instructor and the group. Follow it top to bottom.
- **`reference/`** — cheat-sheets for Skills, Rules, Hooks, and Modes. Point learners here when they want the deeper detail.
- **`../../projects/research-agent/`** — the starter code. Intentionally incomplete. The TODO markers are what we complete together.

Grab a drink. This is the fun one.
