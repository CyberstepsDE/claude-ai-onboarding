<!-- A Skill defines what the agent CAN do. This one is partially complete — fill in the TODOs together in Session 2. -->

# Skill: research_topic

## When to use

Use this skill whenever the user asks a question that requires looking things up on the web. Examples: "What are the latest AI safety papers?", "How does technique X compare to technique Y?", "Who is currently leading in area Z?" If the answer needs facts you don't already have, this is the skill to run.

Do **not** use this skill for questions the user can answer themselves, casual chit-chat, or requests for opinions rather than information.

## Behavior

<!--
  TODO (Slide 8): list the steps the agent should take — search, read, extract, cite.
  Suggested pieces to include, in order:
    - How to turn the user's question into good search queries.
    - How many results to open and read (3–5 is a good starting number).
    - How to extract the key claims from each source.
    - How to cite (link + short attribution).
    - What to do if two sources disagree.
  Write each step as a numbered instruction.
-->

## Output format

<!--
  TODO (Slide 8): define the exact shape of the answer.
  Suggested sections to include:
    - **Question** — restate what was asked, briefly.
    - **Summary** — 2–3 sentences answering it.
    - **Key Findings** — bulleted list, each with a source link.
    - **Sources** — full list of URLs actually read.
  Keep it consistent. Every response should look the same.
-->
