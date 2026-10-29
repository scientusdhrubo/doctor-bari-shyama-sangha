(() => {
  "use strict";
  const translations = window.SITE_TRANSLATIONS || {};
  const content = window.SITE_CONTENT || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let currentLang = "bn";
  let galleryItems = [];
  let lightboxIndex = 0;
  let lastFocus = null;
  let touchStartX = null;

  function safeGetLanguage() {
    try { return localStorage.getItem("dbss-language"); } catch (_) { return null; }
  }
  function safeSetLanguage(lang) {
    try { localStorage.setItem("dbss-language", lang); } catch (_) { /* private browsing/storage disabled */ }
  }
  function t(key) { return (translations[currentLang] && translations[currentLang][key]) || key; }
  function localized(value) {
    if (value && typeof value === "object") return value[currentLang] || value.bn || value.en || "";
    return value == null ? "" : String(value);
  }
  function setText(node, value) { if (node) node.textContent = value; }

  function applyLanguage(lang) {
    currentLang = translations[lang] ? lang : "bn";
    document.documentElement.lang = currentLang;
    document.body.classList.toggle("lang-en", currentLang === "en");
    $$("[data-i18n]").forEach(node => setText(node, t(node.dataset.i18n)));
    $$("[data-i18n-aria]").forEach(node => node.setAttribute("aria-label", t(node.dataset.i18nAria)));
    $$("[data-i18n-alt]").forEach(node => node.setAttribute("alt", t(node.dataset.i18nAlt)));
    $$(".lang-button").forEach(button => {
      const active = button.dataset.lang === currentLang;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const menuButton = $("#menuToggle");
    if (menuButton) menuButton.setAttribute("aria-label", $("#primaryNav").classList.contains("is-open") ? t("closeMenu") : t("openMenu"));
    renderCatalogs();
    renderGalleryFilters();
    renderGallery();
    renderEvents();
    renderContact();
    renderSocials();
    renderAnnouncement();
  }

  function renderAnnouncement() {
    const node = $("#announcement");
    const item = content.announcement || {};
    const message = localized({bn:item.bn, en:item.en});
    if (item.enabled && message.trim()) { node.textContent = message; node.hidden = false; }
    else { node.textContent = ""; node.hidden = true; }
  }

  function renderCatalogs() {
    const filters = $("#catalogFilters"), grid = $("#catalogGrid");
    if (!filters || !grid) return;
    const years = [...new Set((content.catalogs || []).map(item => String(item.year)))].sort((a,b) => b.localeCompare(a));
    filters.replaceChildren();
    const allButton = makeFilterButton(t("filterAll"), "all", true);
    filters.append(allButton);
    years.forEach(year => filters.append(makeFilterButton(year, year, false)));
    grid.replaceChildren();
    const catalogs = content.catalogs || [];
    if (!catalogs.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = currentLang === "bn" ? "বার্ষিক ক্যাটালগ শিগগিরই এখানে যুক্ত হবে।" : "Annual idol catalogs will be added here when available.";
      grid.append(empty); return;
    }
    catalogs.forEach(item => {
      const article = document.createElement("article");
      article.className = "catalog-card"; article.dataset.year = String(item.year);
      const img = document.createElement("img"); img.src = item.image; img.alt = localized(item.title); img.loading = "lazy"; img.addEventListener("error", () => markMissing(img));
      const body = document.createElement("div"); body.className = "catalog-card-body";
      const year = document.createElement("span"); year.className = "catalog-year"; year.textContent = `${t("yearLabel")} ${item.year}`;
      const title = document.createElement("h3"); title.textContent = localized(item.title);
      const desc = document.createElement("p"); desc.textContent = localized(item.description);
      body.append(year,title,desc);
      if (item.pdf && isSafeLocalPath(item.pdf)) {
        const link = document.createElement("a"); link.className = "text-link"; link.href = item.pdf; link.target = "_blank"; link.rel = "noopener"; link.textContent = t("catalogPdf"); body.append(link);
      } else {
        const note = document.createElement("p"); note.textContent = t("catalogNoPdf"); body.append(note);
      }
      article.append(img,body); grid.append(article);
    });
    filters.addEventListener("click", onCatalogFilter, { once: true });
  }
  function onCatalogFilter(event) {
    const button = event.target.closest("button[data-filter]");
    if (!button) { $("#catalogFilters")?.addEventListener("click", onCatalogFilter, { once: true }); return; }
    $$("#catalogFilters .filter-button").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
    $$("#catalogGrid .catalog-card").forEach(card => { card.hidden = button.dataset.filter !== "all" && card.dataset.year !== button.dataset.filter; });
    $("#catalogFilters")?.addEventListener("click", onCatalogFilter, { once: true });
  }
  function makeFilterButton(label, value, active) {
    const button = document.createElement("button"); button.type = "button"; button.className = "filter-button"; button.dataset.filter = value; button.textContent = label; button.setAttribute("aria-pressed", String(active)); return button;
  }

  function categoryLabel(category) {
    const map = {all:"filterAll", idols:"filterIdols", venue:"filterVenue", moments:"filterMoments", culture:"filterCulture", memories:"filterMemories"};
    return t(map[category] || "filterAll");
  }
  function renderGalleryFilters() {
    const filters = $("#galleryFilters"); if (!filters) return;
    const categories = ["all","idols","venue","moments","culture","memories"];
    filters.replaceChildren();
    categories.forEach((category, index) => filters.append(makeFilterButton(categoryLabel(category), category, index === 0)));
  }
  function renderGallery(category = "all") {
    const grid = $("#galleryGrid"); if (!grid) return;
    galleryItems = (content.gallery || []).filter(item => category === "all" || item.category === category);
    grid.replaceChildren();
    if (!galleryItems.length) {
      const empty = document.createElement("p"); empty.className = "empty-state"; empty.textContent = t("galleryEmpty"); grid.append(empty); return;
    }
    galleryItems.forEach((item, index) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "gallery-item"; button.dataset.index = String(index); button.setAttribute("aria-label", `${t("viewImage")}: ${localized(item.caption)}`);
      const img = document.createElement("img"); img.src = item.image; img.alt = localized(item.alt); img.loading = "lazy"; img.addEventListener("error", () => markMissing(img));
      const caption = document.createElement("span"); caption.className = "gallery-caption"; caption.textContent = localized(item.caption);
      button.append(img, caption); grid.append(button);
    });
  }
  function markMissing(img) {
    img.classList.add("is-missing"); img.removeAttribute("src"); img.alt = t("imageUnavailable");
  }

  function renderEvents() {
    const grid = $("#eventsGrid"); if (!grid) return;
    grid.replaceChildren();
    const events = content.events || [];
    if (!events.length) {
      const empty = document.createElement("div"); empty.className = "empty-state"; empty.textContent = t("eventsEmpty"); grid.append(empty); return;
    }
    events.slice().sort((a,b) => (a.date || "").localeCompare(b.date || "")).forEach(event => {
      const article = document.createElement("article"); article.className = "event-card";
      if (event.poster && isSafeLocalPath(event.poster)) {
        const img = document.createElement("img"); img.className = "event-poster"; img.src = event.poster; img.alt = localized(event.title); img.loading = "lazy"; img.addEventListener("error", () => img.remove()); article.append(img);
      }
      const date = document.createElement("div"); date.className = "event-date"; date.textContent = formatDate(event.date);
      const title = document.createElement("h3"); title.textContent = localized(event.title);
      const desc = document.createElement("p"); desc.textContent = localized(event.description);
      article.append(date,title,desc);
      if (event.time) { const time = document.createElement("p"); time.className = "event-meta"; time.textContent = `${t("eventTime")}: ${event.time}`; article.append(time); }
      if (localized(event.location)) { const place = document.createElement("p"); place.className = "event-meta"; place.textContent = `${t("eventPlace")}: ${localized(event.location)}`; article.append(place); }
      grid.append(article);
    });
  }
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(`${dateString}T12:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    try { return new Intl.DateTimeFormat(currentLang === "bn" ? "bn-BD" : "en-GB", {day:"numeric",month:"long",year:"numeric"}).format(date); }
    catch (_) { return dateString; }
  }
  function validUrl(raw) {
    if (!raw || typeof raw !== "string") return "";
    try { const url = new URL(raw); return ["https:","http:"].includes(url.protocol) ? url.href : ""; } catch (_) { return ""; }
  }
  function isSafeLocalPath(path) { return typeof path === "string" && !/^(?:javascript:|data:|https?:\/\/)/i.test(path) && !path.includes(".."); }
  function renderContact() {
    const wrap = $("#contactDetails"); if (!wrap) return;
    wrap.replaceChildren();
    const org = content.organization || {};
    const details = [
      {label:t("addressLabel"),value:localized({bn:"দক্ষিণ কাঞ্চনা, সাতকানিয়া, চট্টগ্রাম, বাংলাদেশ",en:org.address || t("contactLocation")}),icon:"⌖",href:validUrl(org.maps) || (org.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org.address)}` : "")},
      {label:t("phoneLabel"),value:org.phone,icon:"☎",href:org.phone && /^[+\d()\-\s]{7,25}$/.test(org.phone) ? `tel:${org.phone.replace(/[^\d+]/g,"")}` : ""},
      {label:t("emailLabel"),value:org.email,icon:"✉",href:org.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(org.email) ? `mailto:${org.email}` : ""},
      {label:t("facebookLabel"),value:org.facebook ? (currentLang === "bn" ? "অফিশিয়াল ফেসবুক পেজ" : "Official Facebook Page") : "",icon:"f",href:validUrl(org.facebook)}
    ];
    details.forEach(item => {
      if (!item.value) return;
      const row = document.createElement("div"); row.className = "contact-row";
      const icon = document.createElement("span"); icon.className = "contact-icon"; icon.setAttribute("aria-hidden","true"); icon.textContent = item.icon;
      const copy = document.createElement("div"); const label = document.createElement("small"); label.textContent = item.label;
      const value = item.href ? document.createElement("a") : document.createElement("strong");
      if (item.href) { value.href = item.href; if (item.href.startsWith("https:")) { value.target = "_blank"; value.rel = "noopener noreferrer"; } }
      value.textContent = item.value; copy.append(label,value); row.append(icon,copy); wrap.append(row);
    });
  }
  function renderSocials() {
    const wrap = $("#footerSocials"); if (!wrap) return; wrap.replaceChildren();
    const href = validUrl((content.organization || {}).facebook);
    if (href) { const link = document.createElement("a"); link.href = href; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = t("facebookLabel"); wrap.append(link); }
  }

  function openLightbox(index, trigger) {
    if (!galleryItems.length) return;
    lightboxIndex = (index + galleryItems.length) % galleryItems.length;
    lastFocus = trigger || document.activeElement;
    updateLightbox();
    const box = $("#lightbox"); box.hidden = false; document.body.style.overflow = "hidden"; $("#lightboxClose").focus();
  }
  function updateLightbox() {
    const item = galleryItems[lightboxIndex]; if (!item) return;
    const image = $("#lightboxImage"); image.classList.remove("is-missing"); image.src = item.image; image.alt = localized(item.alt);
    image.onerror = () => markMissing(image);
    setText($("#lightboxCaption"), localized(item.caption));
    const multiple = galleryItems.length > 1;
    $("#lightboxPrev").hidden = !multiple; $("#lightboxNext").hidden = !multiple;
  }
  function closeLightbox() {
    const box = $("#lightbox"); if (box.hidden) return;
    box.hidden = true; document.body.style.overflow = ""; $("#lightboxImage").src = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  function moveLightbox(delta) { lightboxIndex = (lightboxIndex + delta + galleryItems.length) % galleryItems.length; updateLightbox(); }

  function setupNavigation() {
    const toggle = $("#menuToggle"), panel = $("#primaryNav");
    toggle.addEventListener("click", () => {
      const open = !panel.classList.contains("is-open"); panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open)); toggle.setAttribute("aria-label", open ? t("closeMenu") : t("openMenu"));
    });
    $$("#primaryNav a").forEach(link => link.addEventListener("click", () => { panel.classList.remove("is-open"); toggle.setAttribute("aria-expanded","false"); toggle.setAttribute("aria-label",t("openMenu")); }));
    document.addEventListener("click", event => { if (panel.classList.contains("is-open") && !panel.contains(event.target) && !toggle.contains(event.target)) { panel.classList.remove("is-open"); toggle.setAttribute("aria-expanded","false"); toggle.setAttribute("aria-label",t("openMenu")); } });
  }
  function setupLightbox() {
    $("#galleryGrid").addEventListener("click", event => { const button = event.target.closest(".gallery-item"); if (button) openLightbox(Number(button.dataset.index), button); });
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightboxPrev").addEventListener("click", () => moveLightbox(-1));
    $("#lightboxNext").addEventListener("click", () => moveLightbox(1));
    $("#lightbox").addEventListener("click", event => { if (event.target.id === "lightbox") closeLightbox(); });
    $("#lightbox").addEventListener("touchstart", event => { touchStartX = event.changedTouches[0].screenX; }, {passive:true});
    $("#lightbox").addEventListener("touchend", event => {
      if (touchStartX === null) return; const diff = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 45) moveLightbox(diff > 0 ? -1 : 1); touchStartX = null;
    }, {passive:true});
    document.addEventListener("keydown", event => {
      const box = $("#lightbox"); if (box.hidden) return;
      if (event.key === "Escape") { closeLightbox(); return; }
      if (event.key === "ArrowLeft") { event.preventDefault(); moveLightbox(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); moveLightbox(1); }
      if (event.key === "Tab") {
        const focusables = $$("#lightbox button:not([hidden])");
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  function init() {
    $("#copyrightYear").textContent = String(new Date().getFullYear());
    setupNavigation(); setupLightbox();
    $$(".lang-button").forEach(button => button.addEventListener("click", () => { safeSetLanguage(button.dataset.lang); applyLanguage(button.dataset.lang); }));
    $("#galleryFilters").addEventListener("click", event => {
      const button = event.target.closest("button[data-filter]"); if (!button) return;
      $$("#galleryFilters .filter-button").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
      renderGallery(button.dataset.filter);
    });
    applyLanguage(safeGetLanguage() || "bn");
    // Add a generic fallback if logo file is not yet supplied.
    $$('img[data-fallback="logo"]').forEach(img => img.addEventListener("error", () => { img.style.display = "none"; }));
  }
  document.addEventListener("DOMContentLoaded", init);
})();