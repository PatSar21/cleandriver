import qrcode from "qrcode-generator";
import { PROFILE, CONTENT, CAREER, PROJECTS, DRAFT_MODE } from "./content.js";

const LANG_KEY = "ps-lang";
const stored = localStorage.getItem(LANG_KEY);
const browserDe = (navigator.language || "de").toLowerCase().startsWith("de");
let lang = stored === "de" || stored === "en" ? stored : browserDe ? "de" : "en";

const t = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), CONTENT[lang]);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>'
};

/* ---------- render ---------- */

function renderStatic() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-t]").forEach((n) => {
    const v = t(n.dataset.t);
    if (typeof v === "string") n.textContent = v;
  });
  document.getElementById("loc-text").textContent =
    lang === "de" ? PROFILE.location : PROFILE.locationEn;
  document.querySelectorAll(".lang button").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  document.getElementById("year").textContent = String(new Date().getFullYear());
  document.title = `Patrick Sarpen — ${t("hero.role")}`;
}

function renderDraft() {
  const slot = document.getElementById("draft-slot");
  slot.innerHTML = "";
  if (!DRAFT_MODE) return;
  slot.appendChild(el("div", "draft-note",
    `<span>⚠</span><span><strong>${esc(t("draft.title"))}:</strong> ${esc(t("draft.body"))}</span>`));
}

function renderPhoto() {
  const slot = document.getElementById("photo-slot");
  slot.innerHTML = "";
  const img = new Image();
  img.alt = PROFILE.name;
  img.decoding = "async";
  img.src = PROFILE.photo;
  img.onerror = () => { slot.innerHTML = `<div class="ph" aria-label="${esc(PROFILE.name)}">${esc(PROFILE.initials)}</div>`; };
  slot.appendChild(img);
}

function renderStats() {
  const box = document.getElementById("stats");
  box.innerHTML = "";
  t("hero.stats").forEach((s) => {
    box.appendChild(el("div", "stat", `<div class="v">${esc(s.value)}</div><div class="l">${esc(s.label)}</div>`));
  });
}

function renderAbout() {
  const box = document.getElementById("about-body");
  box.innerHTML = t("about.body").map((p) => `<p>${esc(p)}</p>`).join("");
}

function renderProjects() {
  const grid = document.getElementById("proj-grid");
  grid.innerHTML = "";
  PROJECTS.forEach((p) => {
    const live = p.status === "live" && p.url;
    const card = el("article", "proj" + (p.placeholder ? " is-placeholder" : ""));
    card.innerHTML = `
      <div class="proj-top">
        <h3 class="proj-name">${esc(p.name)}</h3>
        <span class="badge ${live ? "is-live" : ""}"><span class="dot"></span>${esc(live ? t("projects.statusLive") : t("projects.statusBuilding"))}</span>
      </div>
      <p class="proj-body">${esc(p.body[lang])}</p>
      <div class="tags">${p.tags.map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>
      ${p.url ? `<a class="proj-link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(t("projects.open"))} ${ICONS.arrow}</a>` : ""}
    `;
    grid.appendChild(card);
  });
}

function renderCareer() {
  const tl = document.getElementById("timeline");
  tl.innerHTML = "";

  const buildItem = (c) => {
    const end = c.toUnknown ? t("career.unknownEnd") : c.to || (c.from ? t("career.present") : "");
    const period = c.from || c.to
      ? `${esc(c.from || "")}${c.from ? " — " : ""}${esc(end)}`
      : (lang === "de" ? "Zeitraum offen" : "Dates pending");
    const item = el("div",
      "tl-item" + (c.kind === "education" ? " is-edu" : "") + (c.placeholder ? " is-placeholder" : ""));
    item.innerHTML = `
      <div class="tl-period">${period}</div>
      <h3 class="tl-role">${esc(c.role[lang])}${DRAFT_MODE && c.confirm ? `<span class="todo">${lang === "de" ? "prüfen" : "confirm"}</span>` : ""}</h3>
      <div class="tl-company">${esc(c.company)}</div>
      <p class="tl-body">${esc(c.body[lang])}</p>
    `;
    return item;
  };

  CAREER.filter((c) => !c.early).forEach((c) => tl.appendChild(buildItem(c)));

  const earlier = CAREER.filter((c) => c.early);
  if (!earlier.length) return;

  const more = el("div", "tl-more");
  earlier.forEach((c) => more.appendChild(buildItem(c)));
  more.hidden = true;

  const toggle = el("button", "tl-toggle");
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  const setLabel = () => {
    const open = !more.hidden;
    toggle.innerHTML = `<span>${esc(open ? t("career.hideEarlier") : t("career.showEarlier"))}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>`;
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => { more.hidden = !more.hidden; setLabel(); });
  setLabel();

  tl.appendChild(toggle);
  tl.appendChild(more);
}

function renderContact() {
  const rows = document.getElementById("contact-rows");
  rows.innerHTML = "";
  const missing = lang === "de" ? "noch nicht hinterlegt" : "not set yet";

  const row = (icon, value, href) => {
    const r = el("div", "crow");
    r.innerHTML = `${icon}<span class="val${value ? "" : " is-empty"}">${value ? esc(value) : esc(missing)}</span>`;
    if (value) {
      const b = el("button", null, t("contact.copy"));
      b.type = "button";
      b.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(value); } catch { /* clipboard blocked */ }
        b.textContent = t("contact.copied");
        setTimeout(() => (b.textContent = t("contact.copy")), 1600);
      });
      r.appendChild(b);
      if (href) r.querySelector(".val").innerHTML = `<a href="${esc(href)}" style="color:inherit">${esc(value)}</a>`;
    }
    rows.appendChild(r);
  };

  row(ICONS.mail, PROFILE.email, PROFILE.email ? `mailto:${PROFILE.email}` : null);
  row(ICONS.phone, PROFILE.phone, PROFILE.phone ? `tel:${PROFILE.phone.replace(/\s/g, "")}` : null);
  row(ICONS.link, "linkedin.com/in/patrick-sarpen", PROFILE.linkedin);

  const emailBtn = document.getElementById("email-btn");
  emailBtn.href = PROFILE.email ? `mailto:${PROFILE.email}` : "#contact";
  document.getElementById("li-btn").href = PROFILE.linkedin;
}

function renderQR() {
  const box = document.getElementById("qr");
  const url = location.origin + location.pathname;
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  const svg = box.querySelector("svg");
  if (svg) { svg.removeAttribute("width"); svg.removeAttribute("height"); }
}

function renderAll() {
  renderStatic();
  renderDraft();
  renderStats();
  renderAbout();
  renderProjects();
  renderCareer();
  renderContact();
}

/* ---------- behaviour ---------- */

function initLang() {
  document.querySelectorAll(".lang button").forEach((b) => {
    b.addEventListener("click", () => {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      localStorage.setItem(LANG_KEY, lang);
      renderAll();
    });
  });
}

function initScroll() {
  const bar = document.getElementById("topbar");
  const onScroll = () => bar.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px" });
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
}

renderPhoto();
renderAll();
renderQR();
initLang();
initScroll();
