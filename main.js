// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT METHODS: edit this list to add, remove or update ways to pay.
//   address: ""      → the card shows "Details on your invoice"
//   qr: false        → no QR button (e.g. for a Pay ID)
// Copy a line to add another network, e.g. USDT on BEP-20.
// ─────────────────────────────────────────────────────────────────────────────
const PAYMENTS = [
  { symbol: "₮", name: "USDT", network: "TRC-20 · Tron network", address: "TLf9qkWBBxH1NPVQFg2ZzcxZrsbCy7p31T", color: "#26A17B" },
  { symbol: "◎", name: "Solana", network: "SOL · USDC · USDT (SPL)", address: "6EMFdzT9K9E25ZgvyDDKdjMANLvgW1habY3zofTnFsBQ", color: "#9945FF" },
  { symbol: "₿", name: "Bitcoin", network: "BTC network", address: "15TnWYZySMC8KHuoAWQQsMAKJWts8g8fua", color: "#F7931A" },
  { symbol: "Ξ", name: "Ethereum", network: "ETH · ERC-20 tokens", address: "0xdbAB2a1c7FaAC113384741BB7769BE1E023C2109", color: "#627EEA" },
  { symbol: "B", name: "Binance Pay", network: "Pay ID · instant, off-chain", address: "STINGER961", color: "#F0B90B", qr: false },
  { symbol: "W", name: "Whish Money", network: "Lebanon", address: "", color: "#E4007C" },
];
const CONTACT_FOR_DETAILS = "https://t.me/Stingerr961";

// ─────────────────────────────────────────────────────────────────────────────

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = el("textarea"); ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta);
    ta.select(); const ok = document.execCommand("copy"); ta.remove(); return ok;
  }
}

function qrSvg(text) {
  if (typeof qrcode !== "function") return null;
  const qr = qrcode(0, "M");
  qr.addData(text); qr.make();
  const n = qr.getModuleCount(), m = 2, size = n + m * 2;
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + m} ${r + m}h1v1h-1z`;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`); svg.setAttribute("shape-rendering", "crispEdges");
  svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "QR code");
  const bg = document.createElementNS(ns, "rect"); bg.setAttribute("width", size); bg.setAttribute("height", size); bg.setAttribute("fill", "#fff");
  const p = document.createElementNS(ns, "path"); p.setAttribute("d", d); p.setAttribute("fill", "#0B0D11");
  svg.append(bg, p);
  return svg;
}

function renderPayments() {
  const list = document.getElementById("payList");
  if (!list) return;
  const dlg = document.getElementById("qrDialog");
  PAYMENTS.forEach((p) => {
    const card = el("article", "paycard");
    const icon = el("span", "paycard__icon", p.symbol);
    icon.style.setProperty("--c", p.color || "#F4B400");
    const head = el("div", "paycard__head");
    const title = el("div");
    title.append(el("h3", null, p.name), el("p", "paycard__net", p.network));
    head.append(icon, title);
    card.append(head);

    if (p.address) {
      card.append(el("code", "paycard__addr", p.address));
      const row = el("div", "paycard__actions");
      const copy = el("button", "btn btn--sm", "Copy");
      copy.type = "button";
      copy.setAttribute("aria-label", `Copy ${p.name} ${p.network} address`);
      copy.addEventListener("click", async () => {
        const ok = await copyText(p.address);
        copy.textContent = ok ? "Copied ✓" : "Press Ctrl+C";
        setTimeout(() => (copy.textContent = "Copy"), 1600);
      });
      row.append(copy);
      if (p.qr !== false) {
        const qrBtn = el("button", "btn btn--sm btn--ghost", "QR");
        qrBtn.type = "button";
        qrBtn.setAttribute("aria-label", `Show QR code for ${p.name}`);
        qrBtn.addEventListener("click", () => {
          const box = document.getElementById("qrCode");
          box.replaceChildren(qrSvg(p.address) || el("p", null, "QR unavailable, use Copy instead."));
          document.getElementById("qrTitle").textContent = p.name;
          document.getElementById("qrNet").textContent = p.network;
          document.getElementById("qrAddr").textContent = p.address;
          if (dlg && dlg.showModal) dlg.showModal();
        });
        row.append(qrBtn);
      }
      card.append(row);
    } else {
      card.classList.add("paycard--soon");
      card.append(el("p", "paycard__addr paycard__addr--muted", "Details on your invoice"));
      const ask = el("a", "btn btn--sm btn--ghost", "Ask for details");
      ask.href = CONTACT_FOR_DETAILS;
      const row = el("div", "paycard__actions"); row.append(ask); card.append(row);
    }
    list.append(card);
  });
  if (dlg) dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}

// Brief form → prefilled email (static hosting, no backend needed)
function initBrief() {
  const form = document.getElementById("briefForm");
  const need = document.getElementById("needSelect");
  document.querySelectorAll("[data-need]").forEach((a) =>
    a.addEventListener("click", () => {
      if (!need) return;
      const opt = [...need.options].find((o) => o.text === a.dataset.need);
      if (opt) need.value = opt.value;
    })
  );
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const subject = `${d.need}: ${d.company || d.name}`;
    const body = [
      `Name: ${d.name}`,
      `Company / website: ${d.company || "-"}`,
      `Need: ${d.need}`,
      `Budget: ${d.budget}`,
      `Timeline: ${d.timeline}`,
      "",
      d.task,
    ].join("\n");
    window.location.href = `mailto:naghiayman@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// Gentle reveal on scroll
function initReveal() {
  const els = document.querySelectorAll(".section h2, .pain article, .offer, .bundle, .bot, .case, .steps li, .care, .paycard, .form");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  els.forEach((n) => n.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((n) => io.observe(n));
}

renderPayments();
initBrief();
initReveal();
