// Minimal chat widget backed by /api/chat.
// Keeps the entire conversation client-side and posts it on every turn.

const chatEls = {
  toggle: document.getElementById("chat-toggle"),
  panel: document.getElementById("chat-panel"),
  close: document.getElementById("chat-close"),
  messages: document.getElementById("chat-messages"),
  form: document.getElementById("chat-form"),
  input: document.getElementById("chat-input"),
};

const chatState = {
  history: [], // {role: "user" | "assistant", content: string}
  pending: false,
};

chatEls.toggle.addEventListener("click", () => {
  chatEls.panel.classList.toggle("hidden");
  if (!chatEls.panel.classList.contains("hidden")) {
    chatEls.input.focus();
  }
});
chatEls.close.addEventListener("click", () => chatEls.panel.classList.add("hidden"));

chatEls.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = chatEls.input.value.trim();
  if (!text || chatState.pending) return;

  addBubble("user", text);
  chatState.history.push({ role: "user", content: text });
  chatEls.input.value = "";

  chatState.pending = true;
  const thinking = addBubble("assistant", "…");
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatState.history }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Chat endpoint returned ${res.status}: ${err}`);
    }
    const data = await res.json();
    thinking.textContent = data.reply || "(empty response)";
    chatState.history.push({ role: "assistant", content: data.reply || "" });
  } catch (err) {
    thinking.textContent = `⚠ ${err.message}`;
    thinking.classList.add("chat-msg-error");
  } finally {
    chatState.pending = false;
    chatEls.messages.scrollTop = chatEls.messages.scrollHeight;
  }
});

function addBubble(role, text) {
  const el = document.createElement("div");
  el.className = `chat-msg ${role}`;
  el.textContent = text;
  chatEls.messages.appendChild(el);
  chatEls.messages.scrollTop = chatEls.messages.scrollHeight;
  return el;
}
