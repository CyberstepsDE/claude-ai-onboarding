# Session 1 — Exercises

Short, hands-on prompts to reinforce the Session 1 **concepts**. These are discussion starters, not tests. There are no answer keys — bring your thinking to the group.

Skills, Rules, Hooks, and prompt-injection exercises live in Session 2.

## 1. Pick the right model

You have three tasks. Which Claude model would you pick for each, and why?

- **A.** Auto-tagging 50,000 short support tickets by topic every night.
- **B.** Helping an engineer refactor a tricky piece of code in a large repository.
- **C.** Writing a one-year strategy document with careful reasoning about industry trends.

**Hint:** think about three axes — speed, cost, and depth. Which model wins on each?

## 2. Write your own `CLAUDE.md`

Imagine a project of your own — a study buddy for a class, a helper for your team's weekly report, a personal reading list assistant, anything you'd actually use. Draft a short `CLAUDE.md` for it: what the project is, the role Claude should play, two "how I like to work" preferences, and two "what to avoid" items.

**Hint:** the shorter and more specific, the better. If a rule could apply to any project, it's too vague.

## 3. Estimate tokens and cost

Here's a sample prompt you might send to Claude every hour, all day:

> "Summarize the last 24 hours of customer support tickets in three bullet points. Ticket data: [about 5,000 words of tickets pasted in]."

Roughly how many tokens is that? What's the input cost if you use Sonnet? What if you switch to Haiku? Which choice makes more sense for a job that runs 24 times a day?

**Hint:** rough rule — 1 token ≈ 3–4 characters, or about ¾ of an English word. Look up the current per-million-token prices at **anthropic.com/pricing**.

## 4. What does a 429 mean, and what do you do?

Your script calls Claude in a tight loop. After a few minutes, every response comes back as an HTTP **429** error. What is the 429 telling you? What are three legitimate responses to it? Which response is *not* legitimate?

**Hint:** the fix is never "retry immediately, harder." Think about waiting, batching, and the difference between per-minute and per-day limits.
