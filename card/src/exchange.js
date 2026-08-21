// Sign-in and the private contact exchange.
// Row Level Security in the database is what actually keeps messages apart;
// this file only decides what to draw.

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, OWNER_EMAIL, ENABLE_GOOGLE } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true, flowType: "pkce" }
});

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let session = null;
let messages = [];
let notice = null;          // { kind: "ok" | "error", text }
let sending = false;
let loaded = false;
let linkSentTo = null;   // email a sign-in link was just sent to

export function initExchange({ t, lang, onRender }) {
  const ctx = { t, lang, onRender };

  supabase.auth.getSession().then(({ data }) => {
    session = data.session;
    if (session) loadMessages(ctx);
    render(ctx);
  });

  supabase.auth.onAuthStateChange((_event, s) => {
    const changed = s?.user?.id !== session?.user?.id;
    session = s;
    if (changed) { messages = []; loaded = false; }
    if (session) linkSentTo = null;
    if (session && !loaded) loadMessages(ctx);
    render(ctx);
  });

  return { render: (next) => render(Object.assign(ctx, next)) };
}

const isOwner = () => session?.user?.email?.toLowerCase() === OWNER_EMAIL;

async function loadMessages(ctx) {
  const { data, error } = await supabase
    .from("card_messages")
    .select("id, sender_name, sender_email, company, body, created_at")
    .order("created_at", { ascending: false });
  loaded = true;
  if (!error) messages = data || [];
  render(ctx);
}

async function signInWithGoogle(ctx) {
  notice = null;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: location.origin + location.pathname }
  });
  if (error) {
    notice = { kind: "error", text: ctx.t("exchange.errorSignIn") };
    render(ctx);
  }
}

const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

async function sendSignInLink(ctx, email) {
  if (!looksLikeEmail(email)) {
    notice = { kind: "error", text: ctx.t("exchange.errorEmail") };
    return render(ctx);
  }

  sending = true;
  notice = null;
  render(ctx);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname }
  });

  sending = false;
  if (error) {
    notice = { kind: "error", text: ctx.t("exchange.errorLink") };
  } else {
    linkSentTo = email;
  }
  render(ctx);
}

async function signOut(ctx) {
  await supabase.auth.signOut();
  messages = [];
  loaded = false;
  notice = null;
  linkSentTo = null;
  render(ctx);
}

async function send(ctx, form) {
  const name = form.name.value.trim();
  const company = form.company.value.trim();
  const body = form.body.value.trim();

  if (!name || !body) {
    notice = { kind: "error", text: ctx.t("exchange.required") };
    return render(ctx);
  }

  sending = true;
  notice = null;
  render(ctx);

  const { error } = await supabase.from("card_messages").insert({
    user_id: session.user.id,
    sender_name: name,
    sender_email: session.user.email || null,
    company: company || null,
    body
  });

  sending = false;
  notice = error
    ? { kind: "error", text: ctx.t("exchange.errorSend") }
    : { kind: "ok", text: ctx.t("exchange.sent") };

  if (error) render(ctx);
  else loadMessages(ctx);
}

function fmtDate(iso, lang) {
  return new Date(iso).toLocaleString(lang === "de" ? "de-DE" : "en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

const GOOGLE_MARK = `<svg viewBox="0 0 48 48" aria-hidden="true" width="18" height="18">
  <path fill="#4285F4" d="M45 24.5c0-1.6-.1-2.8-.4-4H24v7.5h12c-.2 2-1.5 5-4.4 7l6.7 5.2C42.2 36.4 45 31 45 24.5z"/>
  <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8.1 41 15.5 46 24 46z"/>
  <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z"/>
  <path fill="#EA4335" d="M24 10.3c3.3 0 5.5 1.4 6.7 2.6l6-5.9C33 3.6 29.9 2 24 2 15.5 2 8.1 7 4.4 14.1l7.1 5.5c1.8-5.3 6.7-9.3 12.5-9.3z"/>
</svg>`;

function render(ctx) {
  const box = document.getElementById("exchange-body");
  if (!box) return;
  const { t, lang } = ctx;
  box.innerHTML = "";

  const noticeHtml = notice
    ? `<p class="ex-notice is-${notice.kind}">${esc(notice.text)}</p>`
    : "";

  /* ---- signed out ---- */
  if (!session) {
    if (linkSentTo) {
      box.innerHTML = `
        <div class="ex-sent">
          <div class="ex-sent-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>
          </div>
          <h3>${esc(t("exchange.linkSent"))}</h3>
          <p>${esc(t("exchange.linkSentBody")).replace("{email}", `<strong>${esc(linkSentTo)}</strong>`)}</p>
          <button type="button" class="ex-signout" id="ex-again">${esc(t("exchange.linkAgain"))}</button>
        </div>`;
      box.querySelector("#ex-again").addEventListener("click", () => {
        linkSentTo = null; notice = null; render(ctx);
      });
      return;
    }

    box.innerHTML = `
      <p class="ex-intro">${esc(t("exchange.intro"))}</p>
      <form class="ex-form ex-signin-form" id="ex-mail-form" novalidate>
        <label class="ex-field">
          <span>${esc(t("exchange.emailLabel"))}</span>
          <input name="email" type="email" inputmode="email" autocomplete="email"
                 maxlength="200" placeholder="${esc(t("exchange.emailPlaceholder"))}" required>
        </label>
        ${noticeHtml}
        <button type="submit" class="btn btn-primary" ${sending ? "disabled" : ""}>
          ${esc(sending ? t("exchange.sendingLink") : t("exchange.sendLink"))}
        </button>
      </form>
      ${ENABLE_GOOGLE ? `
        <div class="ex-or"><span>${esc(t("exchange.or"))}</span></div>
        <button type="button" class="btn btn-ghost" id="ex-signin">${GOOGLE_MARK}<span>${esc(t("exchange.signIn"))}</span></button>` : ""}
    `;
    const mailForm = box.querySelector("#ex-mail-form");
    mailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      sendSignInLink(ctx, mailForm.elements.email.value.trim());
    });
    const g = box.querySelector("#ex-signin");
    if (g) g.addEventListener("click", () => signInWithGoogle(ctx));
    return;
  }

  /* ---- signed in ---- */
  const user = session.user;
  const suggested = user.user_metadata?.full_name || user.user_metadata?.name || "";

  const head = `
    <div class="ex-who">
      <span class="ex-who-label">${esc(t("exchange.signedInAs"))}</span>
      <strong>${esc(user.email || "")}</strong>
      <button type="button" class="ex-signout" id="ex-signout">${esc(t("exchange.signOut"))}</button>
    </div>`;

  if (isOwner()) {
    box.innerHTML = `
      ${head}
      <div class="ex-inbox-head">
        <h3>${esc(t("exchange.inbox"))}</h3>
        <span class="badge">${messages.length} ${esc(t("exchange.inboxCount"))}</span>
      </div>
      ${messages.length
        ? `<ul class="ex-list">${messages.map((m) => `
            <li class="ex-msg">
              <div class="ex-msg-top">
                <strong>${esc(m.sender_name)}</strong>
                ${m.company ? `<span class="ex-msg-co">${esc(m.company)}</span>` : ""}
                <time>${esc(fmtDate(m.created_at, lang))}</time>
              </div>
              ${m.sender_email ? `<a class="ex-msg-mail" href="mailto:${esc(m.sender_email)}">${esc(m.sender_email)}</a>` : ""}
              <p>${esc(m.body)}</p>
            </li>`).join("")}</ul>`
        : `<p class="ex-empty">${esc(t("exchange.inboxEmpty"))}</p>`}
    `;
    box.querySelector("#ex-signout").addEventListener("click", () => signOut(ctx));
    return;
  }

  box.innerHTML = `
    ${head}
    <form class="ex-form" id="ex-form" novalidate>
      <div class="ex-row">
        <label class="ex-field">
          <span>${esc(t("exchange.nameLabel"))}</span>
          <input name="name" type="text" maxlength="120" autocomplete="name" value="${esc(suggested)}" required>
        </label>
        <label class="ex-field">
          <span>${esc(t("exchange.companyLabel"))}</span>
          <input name="company" type="text" maxlength="160" autocomplete="organization">
        </label>
      </div>
      <label class="ex-field">
        <span>${esc(t("exchange.messageLabel"))}</span>
        <textarea name="body" rows="4" maxlength="4000" placeholder="${esc(t("exchange.messagePlaceholder"))}" required></textarea>
      </label>
      ${noticeHtml}
      <button type="submit" class="btn btn-primary" ${sending ? "disabled" : ""}>
        ${esc(sending ? t("exchange.sending") : t("exchange.send"))}
      </button>
      <p class="ex-privacy">${esc(t("exchange.privacyNote"))}</p>
    </form>

    <div class="ex-mine">
      <h3>${esc(t("exchange.yourMessages"))}</h3>
      ${messages.length
        ? `<ul class="ex-list">${messages.map((m) => `
            <li class="ex-msg">
              <div class="ex-msg-top">
                <strong>${esc(m.sender_name)}</strong>
                ${m.company ? `<span class="ex-msg-co">${esc(m.company)}</span>` : ""}
                <time>${esc(fmtDate(m.created_at, lang))}</time>
              </div>
              <p>${esc(m.body)}</p>
            </li>`).join("")}</ul>`
        : `<p class="ex-empty">${esc(t("exchange.noMessages"))}</p>`}
    </div>
  `;

  box.querySelector("#ex-signout").addEventListener("click", () => signOut(ctx));
  const form = box.querySelector("#ex-form");
  form.addEventListener("submit", (e) => { e.preventDefault(); send(ctx, form.elements); });
}
