# Session 1 — Concepts

Welcome to Session 1. This session is **concepts only**. We'll name the pieces so you can recognize them. Session 2 is where you actually pick them up and build.

## 1. The Claude model family

Claude comes in a few sizes. Pick the one that fits the job.

- **Haiku 4.5** — fast and cheap. Great for simple lookups, quick classification, and anything you'll run at high volume.
- **Sonnet 5** — the default. A strong all-rounder for most work: writing, reasoning, coding, agentic loops.
- **Opus 4.8** — the powerhouse. Reach for it on hard problems: deep research, tricky reasoning, high-stakes work.
- **Fable 5** — the current top tier. When you need the very best available and cost is not the concern.

**Rule of thumb: start with Sonnet.** Move down to Haiku if speed and cost matter more than depth. Move up to Opus or Fable only when Sonnet isn't good enough.

> **Model lineup changes fast.** New models arrive every few months and older ones get retired. Always confirm the current lineup at **anthropic.com/pricing** before teaching this session.

## 2. Core concepts

A few words you'll hear all the time.

- **Prompt** — what you send to Claude. Your question, your instruction, the text you want it to work on.
- **Tokens** — the chunks Claude reads and writes. Roughly 3–4 characters each. You pay per token, so length matters.
- **Context window** — how much text Claude can "see" at once. Everything in the conversation, plus any files it reads, lives in the window.
- **Temperature** — how creative Claude is allowed to be. Low is predictable and repeatable. High is varied and surprising. Most work runs at low or default.

## 3. Rate limits

Anthropic caps how much you can send to Claude per minute or per day. This protects the service and your bill.

- **RPM** — requests per minute.
- **TPM** — tokens per minute.
- **TPD** — tokens per day.

If you exceed a limit, the API returns a **429** error. The fix is not to retry harder — it's to wait, back off, batch, or move to a smaller model.

## 4. System prompts

A **system prompt** is Claude's operating instructions. It's the first thing Claude reads at the start of every session — the **employee handbook** you'd hand a new hire on day one: who they work for, how they should behave, what's off-limits.

You'll see how to write good ones in Session 2. For now, just know what they are.

## 5. `CLAUDE.md`

`CLAUDE.md` is a plain markdown file that lives at the root of a project. Claude Code reads it automatically at the start of every session. Think of it as **passive project memory** — you don't have to remind Claude of the project's context each time; the file does it for you.

There's an example in `examples/CLAUDE.md`. It's the only config-file example in Session 1.

## 6. Claude Code vs. Cowork

Two ways to use Claude for real work.

- **Claude Code** — the terminal / IDE tool. You're in a folder on your machine, Claude reads and edits files there, runs commands, and works alongside you locally.
- **Cowork** — the browser experience. A managed Claude environment for structured collaboration and cloud-hosted work. No local install.

Same model behind both. Different surface. Pick based on where your work already lives.

## Builder's Toolkit — coming in Session 2

You'll meet all of these next session. Just the names for now.

- **Skills** — what Claude *can* do.
- **Rules** — what Claude *cannot* do.
- **Hooks** — automatic before/after checkpoints.
- **Modes** — how much freedom you give Claude in Claude Code.
- **Tools & Agents** — how Claude takes action beyond the chat window.
- **Prompt-injection safety** — how to keep untrusted text from hijacking Claude.
- **Evals** — how you know your agent actually works.

## Next

- Skim `examples/CLAUDE.md` — a realistic example for a fictional support agent.
- Do the short exercises in `exercises/README.md`.
- The case study and every builder topic live in Session 2.

See you there.
