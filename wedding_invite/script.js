(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = !reduceMotion && hasGsap;
  if (!motion) root.classList.remove("motion");

  const TITLES = {
    kn: "ಶುಭವಿವಾಹ · ಭಾಸ್ಕರ ♥ ಮೇಘನಾ · 03-12-2026",
    en: "Shubhavivaha · Bhaskara ♥ Meghana · 3 December 2026",
  };
  const COPIED = { kn: "ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ", en: "Link copied" };
  const lang = () => root.dataset.lang || "kn";

  /* Language ---------------------------------------------------------- */
  function applyLang(l) {
    root.lang = l;
    root.dataset.lang = l;
    document.title = TITLES[l];
    $$("[data-alt-" + l + "]").forEach((img) => (img.alt = img.getAttribute("data-alt-" + l)));
    try { localStorage.setItem("invite-lang", l); } catch (e) { /* private mode */ }
    if (hasGsap) requestAnimationFrame(() => ScrollTrigger.refresh());
  }
  applyLang(lang());
  $("[data-lang-toggle]").addEventListener("click", () => {
    applyLang(lang() === "kn" ? "en" : "kn");
    updateCountdown(true);
  });

  /* Countdown --------------------------------------------------------- */
  const START = Date.parse("2026-12-03T08:20:00+05:30");
  const END = Date.parse("2026-12-03T09:20:00+05:30");
  const cd = $("[data-countdown]");
  const cells = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const live = $("[data-cd-live]");
  let lastLiveMinute = -1;
  const pad = (n) => String(n).padStart(2, "0");

  function updateCountdown(forceLive) {
    const now = Date.now();
    const state = now < START ? "before" : now < END ? "during" : "after";
    $$("[data-cd-state]", cd).forEach((el) => (el.hidden = el.dataset.cdState !== state));
    cd.classList.toggle("is-over", state !== "before");
    if (state !== "before") { live.textContent = ""; return false; }
    let t = Math.floor((START - now) / 1000);
    const d = Math.floor(t / 86400); t -= d * 86400;
    const h = Math.floor(t / 3600); t -= h * 3600;
    const m = Math.floor(t / 60); const s = t - m * 60;
    cells.d.textContent = pad(d); cells.h.textContent = pad(h);
    cells.m.textContent = pad(m); cells.s.textContent = pad(s);
    // Screen readers get a polite update at most once a minute.
    const minuteKey = d * 1440 + h * 60 + m;
    if (forceLive || minuteKey !== lastLiveMinute) {
      lastLiveMinute = minuteKey;
      live.textContent = lang() === "kn"
        ? `ಮುಹೂರ್ತಕ್ಕೆ ಇನ್ನು ${d} ದಿನ ${h} ಗಂಟೆ ${m} ನಿಮಿಷ`
        : `${d} days, ${h} hours and ${m} minutes until the Muhurtha`;
    }
    return true;
  }
  if (updateCountdown()) {
    const timer = setInterval(() => { if (!updateCountdown()) clearInterval(timer); }, 1000);
  }

  /* Map: load third-party iframe only on request ----------------------- */
  const mapBtn = $("[data-map-load]");
  mapBtn.addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.title = "Map — Sri Guru Siddarameshwara Samudaya Bhavana, Turuvekere";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = "https://www.google.com/maps?q=13.1696323,76.6696257&z=17&output=embed";
    mapBtn.replaceWith(f);
  });

  /* Share ------------------------------------------------------------- */
  const toast = $("[data-toast]");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2400);
  }
  $("[data-share]").addEventListener("click", async () => {
    const data = { title: TITLES[lang()], url: location.href.split("#")[0] };
    if (navigator.share) {
      try { await navigator.share(data); } catch (e) { /* dismissed */ }
      return;
    }
    try { await navigator.clipboard.writeText(data.url); showToast(COPIED[lang()]); }
    catch (e) { prompt("", data.url); }
  });

  /* Music ------------------------------------------------------------ */
  const audio = document.getElementById("bg-audio");
  const musicBtn = document.getElementById("music-btn");
  let musicStarted = false;
  let isMuted = false;
  try { isMuted = localStorage.getItem("invite-music-muted") === "1"; } catch (e) {}

  function setMuted(m) {
    isMuted = m;
    audio.muted = m;
    musicBtn.setAttribute("aria-pressed", m ? "true" : "false");
    try { localStorage.setItem("invite-music-muted", m ? "1" : "0"); } catch (e) {}
  }

  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    audio.muted = isMuted;
    audio.volume = isMuted ? 0.65 : 0;
    audio.play().then(() => {
      musicBtn.classList.add("is-playing");
      if (isMuted) return;
      let v = 0;
      const target = 0.65;
      const step = () => { v = Math.min(v + 0.02, target); audio.volume = v; if (v < target) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }).catch(() => {
      musicStarted = false;
      const unblock = () => {
        startMusic();
        window.removeEventListener("scroll", unblock, { passive: true });
        window.removeEventListener("touchstart", unblock, { passive: true });
        document.removeEventListener("click", unblock);
      };
      window.addEventListener("scroll", unblock, { passive: true });
      window.addEventListener("touchstart", unblock, { passive: true });
      document.addEventListener("click", unblock);
    });
  }

  setTimeout(startMusic, 2000);

  // On any click anywhere, also try to start (covers gesture requirement)
  document.addEventListener("click", function unblockOnClick() {
    startMusic();
    document.removeEventListener("click", unblockOnClick);
  });

  musicBtn.addEventListener("click", () => {
    if (!musicStarted) { startMusic(); return; }
    setMuted(!isMuted);
  });

  document.addEventListener("visibilitychange", () => {
    if (!musicStarted) return;
    if (document.hidden) { audio.pause(); musicBtn.classList.remove("is-playing"); }
    else if (!isMuted) { audio.play().then(() => musicBtn.classList.add("is-playing")).catch(() => {}); }
  });

  /* Printed card viewer ------------------------------------------------ */
  const dialog = $("[data-card-dialog]");
  const tabs = $$('[role="tab"]', dialog);
  function selectTab(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    tab.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        selectTab(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length]);
      }
    });
  });
  $("[data-card-open]").addEventListener("click", () => { dialog.showModal(); lenis && lenis.stop(); });
  $("[data-card-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => lenis && lenis.start());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  /* Nav: hide on scroll down, reveal on scroll up ------------------------ */
  const nav = $("[data-nav]");
  let lastY = scrollY;
  function onScrollNav(y) {
    const down = y > lastY && y > 120;
    nav.classList.toggle("is-hidden", down && !nav.contains(document.activeElement));
    lastY = y;
  }

  /* Smooth scroll ------------------------------------------------------ */
  let lenis = null;
  if (motion && window.Lenis) {
    try {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
      lenis.on("scroll", (e) => { ScrollTrigger.update(); onScrollNav(e.scroll); });
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } catch (e) { lenis = null; }
  }
  if (!lenis) {
    addEventListener("scroll", () => onScrollNav(scrollY), { passive: true });
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = id === "#top" ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: id === "#top" ? 0 : -48, duration: 1.6 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    if (id !== "#top") { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
  }));

  /* Gallery lightbox -------------------------------------------------- */
  const glDialog = document.getElementById("gallery-lightbox");
  const glImg = document.getElementById("gl-img");
  const glCounter = document.getElementById("gl-counter");
  const glPrev = document.getElementById("gl-prev");
  const glNext = document.getElementById("gl-next");
  const galleryItems = $$(".gallery__item[data-gallery-open]");
  const totalGallery = galleryItems.length;
  let currentGalleryIdx = 0;

  function getGalleryItem(idx) {
    const item = galleryItems[idx];
    if (!item) return null;
    const img = item.querySelector("img");
    const sources = [...item.querySelectorAll("source[type='image/webp']")];
    let srcset = sources.length ? sources[sources.length - 1].srcset : "";
    const m = srcset.match(/(\S+)\s+1600w/);
    return { src: m ? m[1] : img.src, alt: img.dataset.altEn || img.alt };
  }

  function glShow(idx) {
    currentGalleryIdx = ((idx % totalGallery) + totalGallery) % totalGallery;
    const { src, alt } = getGalleryItem(currentGalleryIdx);
    glImg.src = src;
    glImg.alt = alt;
    glCounter.textContent = `${currentGalleryIdx + 1} / ${totalGallery}`;
    glPrev.style.opacity = totalGallery > 1 ? "1" : "0";
    glNext.style.opacity = totalGallery > 1 ? "1" : "0";
  }

  function glOpen(idx) {
    glShow(idx);
    glDialog.showModal();
    if (lenis) lenis.stop();
  }

  function glClose() {
    glDialog.close();
    if (lenis) lenis.start();
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => glOpen(parseInt(item.dataset.galleryOpen, 10)));
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); glOpen(parseInt(item.dataset.galleryOpen, 10)); } });
  });

  document.getElementById("gl-close").addEventListener("click", glClose);
  glPrev.addEventListener("click", () => glShow(currentGalleryIdx - 1));
  glNext.addEventListener("click", () => glShow(currentGalleryIdx + 1));

  glDialog.addEventListener("click", (e) => { if (e.target === glDialog) glClose(); });
  glDialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") glShow(currentGalleryIdx - 1);
    if (e.key === "ArrowRight") glShow(currentGalleryIdx + 1);
  });

  let glTouchX = null;
  glDialog.addEventListener("touchstart", (e) => { glTouchX = e.touches[0].clientX; }, { passive: true });
  glDialog.addEventListener("touchend", (e) => {
    if (glTouchX === null) return;
    const dx = e.changedTouches[0].clientX - glTouchX;
    if (Math.abs(dx) > 50) glShow(currentGalleryIdx + (dx < 0 ? 1 : -1));
    glTouchX = null;
  });

  /* Auto-scroll -------------------------------------------------------- */
  const autoScrollBtn = document.getElementById("autoscroll-btn");
  let autoScrollActive = false;
  let autoScrollRAF = null;
  let autoScrollPauseTimer = null;
  const AUTO_SCROLL_SPEED = 0.4;

  function autoScrollStep() {
    if (!autoScrollActive) return;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const currentY = lenis ? lenis.scroll : window.scrollY;
    if (currentY >= maxY - 2) { setAutoScroll(false); return; }
    if (lenis) lenis.scrollTo(currentY + AUTO_SCROLL_SPEED, { immediate: true });
    else window.scrollBy(0, AUTO_SCROLL_SPEED);
    autoScrollRAF = requestAnimationFrame(autoScrollStep);
  }

  function setAutoScroll(on) {
    autoScrollActive = on;
    autoScrollBtn.setAttribute("aria-pressed", on ? "true" : "false");
    autoScrollBtn.classList.toggle("is-active", on);
    cancelAnimationFrame(autoScrollRAF);
    if (on) autoScrollRAF = requestAnimationFrame(autoScrollStep);
  }

  function pauseAutoScroll() {
    if (!autoScrollActive) return;
    setAutoScroll(false);
    clearTimeout(autoScrollPauseTimer);
    autoScrollPauseTimer = setTimeout(() => {
      if (!glDialog.open && !dialog.open) setAutoScroll(true);
    }, 4000);
  }

  window.addEventListener("wheel", pauseAutoScroll, { passive: true });
  window.addEventListener("touchmove", pauseAutoScroll, { passive: true });
  window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(e.key)) pauseAutoScroll();
  });

  autoScrollBtn.addEventListener("click", () => {
    clearTimeout(autoScrollPauseTimer);
    setAutoScroll(!autoScrollActive);
  });

  /* Preloader ---------------------------------------------------------- */
  let intro = () => {};
  const preloader = $(".preloader");
  const heroImg = $('[data-hero-img]');

  // Clicking the preloader is the natural first gesture — start music here
  preloader.addEventListener("click", () => startMusic(), { once: true });

  const ready = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    heroImg.decode ? heroImg.decode().catch(() => {}) : Promise.resolve(),
    new Promise((r) => setTimeout(r, reduceMotion ? 0 : 1400)),
  ]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 4000))]).then(() => {
    root.classList.add("is-loaded");
    setTimeout(() => {
      preloader.classList.add("is-done");
      intro();
    }, reduceMotion ? 0 : 1300);
  });

  // Auto-scroll starts after preloader exits — placed before motion guard so it
  // also works on browsers without GSAP.
  if (!reduceMotion) setTimeout(() => setAutoScroll(true), reduceMotion ? 0 : 5000);

  if (!motion) return;

  /* ====================================================================
     Motion layer (GSAP + ScrollTrigger). Only transform & opacity animate.
     ==================================================================== */
  gsap.registerPlugin(ScrollTrigger);
  const ease = "expo.out";

  // Split names into words (Kannada conjuncts must never be split into chars)
  // and Latin names into chars.
  const splits = [];
  if (window.SplitType) {
    $$("[data-split] [data-l]").forEach((el) => {
      splits.push(new SplitType(el, { types: el.dataset.l === "en" ? "words,chars" : "words", tagName: "span" }));
    });
    $$("[data-ink] [data-l]").forEach((el) => new SplitType(el, { types: "words", tagName: "span" }));
  }

  // Gatefold: pin the cover, fade its print, swing the doors open on the couple.
  const gate = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: ".gate", start: "top top", end: "+=140%", scrub: 0.8, pin: true, anticipatePin: 1 },
  });
  gate
    .to(".cover", { opacity: 0, scale: 0.9, y: -30, duration: 0.35 })
    .to(".door--l", { rotateY: -108, duration: 0.65, ease: "power2.inOut" }, 0.15)
    .to(".door--r", { rotateY: 108, duration: 0.65, ease: "power2.inOut" }, 0.15)
    .to(".door", { opacity: 0, duration: 0.15 }, 0.65)
    .fromTo(".hero__img", { scale: 1.2 }, { scale: 1, duration: 0.85 }, 0.15)
    .from(".hero__names > *", { y: 60, opacity: 0, stagger: 0.06, duration: 0.3, ease: "power3.out" }, 0.45)
    .eventCallback("onComplete", () => gsap.set(".door", { willChange: "auto" }));

  // Intro sequence for the cover once the preloader has gone.
  const coverParts = $$(".cover > *:not(.toran)");
  gsap.set(coverParts, { opacity: 0, y: 24 });
  intro = () => {
    gsap.to(coverParts, { opacity: 1, y: 0, duration: 1.4, ease, stagger: 0.09, clearProps: "transform" });
    gsap.from(".toran", { opacity: 0, y: -20, duration: 1.6, ease });
  };

  // Generic reveals.
  $$("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 48, opacity: 0, duration: 1.3, ease,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onStart: () => (el.style.willChange = "transform, opacity"),
      onComplete: () => (el.style.willChange = ""),
    });
  });

  // Names rise letter-by-letter (Latin) / word-by-word (Kannada).
  $$("[data-split]").forEach((h) => {
    const parts = [...$$('[data-l="kn"] .word', h), ...$$('[data-l="en"] .char', h)];
    gsap.from(parts, {
      yPercent: 110, opacity: 0, rotate: 4, duration: 1.2, ease, stagger: 0.035,
      scrollTrigger: { trigger: h, start: "top 85%", once: true },
    });
  });

  // Invitation paragraph inks in as you read.
  $$("[data-ink] .word").length && gsap.fromTo("[data-ink] .word",
    { opacity: 0.12 },
    { opacity: 1, ease: "none", stagger: 0.08,
      scrollTrigger: { trigger: ".note", start: "top 75%", end: "bottom 55%", scrub: true } });

  // Interlude: paper curtain lifts, photo drifts slower than the page.
  gsap.to(".interlude__curtain", {
    scaleY: 0, ease: "power2.inOut",
    scrollTrigger: { trigger: ".interlude", start: "top 85%", end: "top 15%", scrub: true },
  });
  gsap.fromTo(".interlude__img", { yPercent: -7 }, {
    yPercent: 7, ease: "none",
    scrollTrigger: { trigger: ".interlude", start: "top bottom", end: "bottom top", scrub: true },
  });
  gsap.fromTo(".interlude__quote", { yPercent: 40 }, {
    yPercent: -40, ease: "none",
    scrollTrigger: { trigger: ".interlude", start: "top bottom", end: "bottom top", scrub: true },
  });

  // Fine-pointer niceties: magnetic buttons.
  if (finePointer) {
    $$(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.38);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  addEventListener("load", () => ScrollTrigger.refresh());
})();
