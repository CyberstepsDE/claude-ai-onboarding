// Frontend and API are served from the same App Service origin.
// For local dev, override via `window.API_URL` in the browser console.
const DEFAULT_API_URL = "/api/scan";

const els = {
  button: document.getElementById("scan-button"),
  status: document.getElementById("status"),
  summary: document.getElementById("summary"),
  findings: document.getElementById("findings"),
  errors: document.getElementById("errors"),
  countHigh: document.getElementById("count-high"),
  countMedium: document.getElementById("count-medium"),
  countLow: document.getElementById("count-low"),
  countTotal: document.getElementById("count-total"),
};

const SEVERITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

els.button.addEventListener("click", runScan);

async function runScan() {
  const url = window.API_URL || DEFAULT_API_URL;
  els.button.disabled = true;
  setStatus("Scanning…", "running");
  els.findings.innerHTML = "";
  els.errors.classList.add("hidden");

  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      throw new Error(`Scan endpoint returned ${res.status}`);
    }
    const data = await res.json();
    render(data);
    setStatus(`Scan ${data.scan_id.slice(0, 8)}… complete`, "done");
  } catch (err) {
    setStatus(err.message || "Scan failed", "error");
  } finally {
    els.button.disabled = false;
  }
}

function setStatus(text, cls) {
  els.status.textContent = text;
  els.status.className = `status ${cls}`;
}

function render(data) {
  const findings = [...(data.findings || [])].sort((a, b) => {
    const s = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    return s !== 0 ? s : a.rule_id.localeCompare(b.rule_id);
  });

  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  findings.forEach((f) => { counts[f.severity] = (counts[f.severity] || 0) + 1; });

  els.countHigh.textContent = counts.HIGH;
  els.countMedium.textContent = counts.MEDIUM;
  els.countLow.textContent = counts.LOW;
  els.countTotal.textContent = findings.length;
  els.summary.classList.remove("hidden");

  if (findings.length === 0) {
    els.findings.innerHTML = `<p class="empty">No findings. Either your subscription is spotless or the rules need work.</p>`;
  } else {
    els.findings.innerHTML = findings.map(renderFinding).join("");
  }

  const errors = data.rule_errors || [];
  if (errors.length > 0) {
    els.errors.innerHTML = "<strong>Rules that failed to run:</strong><ul>" +
      errors.map((e) => `<li><code>${escape(e.rule_id)}</code>: ${escape(e.error)}</li>`).join("") +
      "</ul>";
    els.errors.classList.remove("hidden");
  }
}

function renderFinding(f) {
  return `
    <article class="finding severity-${escape(f.severity)}">
      <div class="finding-header">
        <h3 class="finding-title">${escape(f.title)}</h3>
        <span class="finding-severity">${escape(f.severity)}</span>
      </div>
      <div class="finding-resource">${escape(f.resource_id || "(no resource)")}</div>
      <div class="finding-body">${escape(f.description)}</div>
      <div class="finding-remediation"><strong>Fix:</strong> ${escape(f.remediation)}</div>
    </article>
  `;
}

function escape(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
