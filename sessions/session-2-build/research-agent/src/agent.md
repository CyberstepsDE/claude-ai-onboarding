# The Agent Loop (Plain English)

This file describes what the agent does every time it runs. There is no code here on purpose — writing the loop in words is how you understand it before you ever automate it.

## The loop, step by step

1. **Receive the question.** The user sends something like "What are the latest AI safety papers?" The agent reads it and restates it internally in one clear sentence.

2. **Decide if a tool is needed.** If the answer is common knowledge and the agent is confident, it can answer directly. If the answer needs fresh facts, current events, or sources it can cite, it uses a tool. For this agent, that tool is web search.

3. **Search the web.** The agent picks a small number of good search queries based on the question. It runs them and collects the most promising results (typically the top 3–5).

4. **Read the results.** For each promising result, the agent opens the page and reads it carefully. It notes the source, the date, and the specific claims it contains.

5. **Summarize.** The agent pulls the key findings across the sources into a short, honest summary. Points of agreement are stated plainly. Points of disagreement are noted, not hidden.

6. **Return a structured answer.** The response follows the exact shape defined in `SKILL.md` — Question, Summary, Key Findings, Sources. Every factual claim links back to where it came from.

7. **Stop when done.** If the answer is complete and cited, the agent stops. It does not keep searching for the sake of searching. It does not add filler.

## Edge case — no results

<!--
  TODO: what should the agent do if the search returns nothing?
  Some paths to consider as a group:
    - Try a different query (rewrite in simpler / broader terms).
    - Widen the search (drop restrictive keywords, change the date range).
    - Give up gracefully and tell the user honestly.
    - Suggest a rephrasing of the question the user could try.
  Pick one primary path and one fallback. Write them here.
-->

## Why this shape works

The loop is small on purpose. Four moving parts — receive, decide, act, respond — are enough to build a real agent. Everything more elaborate is a variation on this same shape.
