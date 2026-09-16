/* ============================================================
   SuccuChan v2 — HOME Hero Slider (data-driven, crossfade)
   - 4 slides (ABOUT / NOX Episode / Ambient / FAN CREATION)
   - autoplay (pauses on hover, focus, interaction, reduced-motion)
   - arrows / dots / swipe / keyboard
   ============================================================ */
(function () {
  var root = document.querySelector("[data-hero]");
  if (!root) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  fetch("assets/data/hero.json")
    .then(function (r) { return r.json(); })
    .then(function (data) { build(root, data); })
    .catch(function (e) { console.error("hero load failed", e); });

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  }); }

  function subHtml(sub) {
    // string, or array of lines (blank string => paragraph gap)
    var lines = Array.isArray(sub) ? sub : String(sub).split("\n");
    return lines.map(function (l) { return l === "" ? "" : esc(l); }).join("<br>");
  }

  function slideInner(s, eager) {
    var body =
      '<div class="hs-body">' +
        (s.label ? '<span class="hs-label">' + esc(s.label) + "</span>" : "") +
        (s.title ? '<span class="hs-title">' + esc(s.title) + "</span>" : "") +
        (s.sub && s.sub.length ? '<span class="hs-sub">' + subHtml(s.sub) + "</span>" : "") +
        '<span class="hs-cta">' + esc(s.cta) + ' <span class="arw" aria-hidden="true">&rarr;</span></span>' +
      "</div>";

    if (s.kind === "brand") {
      var faces = (s.faces || []).map(function (n) {
        return '<span><img src="assets/webp/' + esc(n) + '_face.webp" alt="" loading="lazy"></span>';
      }).join("");
      return '<div class="hs-faces" aria-hidden="true">' + faces + "</div>" + body;
    }
    // image slide
    var op = s.objectPosition || "center center";
    var opm = s.objectPositionMobile || op;
    return '<img class="hs-img" src="' + esc(s.image) + '" alt="" ' +
      (eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') +
      ' decoding="async" style="--op:' + esc(op) + ";--op-m:" + esc(opm) + '">' + body;
  }

  function build(el, data) {
    var slides = data.slides || [];
    if (!slides.length) return;
    var n = slides.length;

    var track = '<div class="hs-track">' + slides.map(function (s, i) {
      var ext = s.external;
      return '<a class="hs-slide hs--' + (s.kind === "brand" ? "brand" : "image") + (i === 0 ? " is-active" : "") + '"' +
        ' href="' + esc(s.href) + '"' +
        (ext ? ' target="_blank" rel="noopener"' : "") +
        ' data-i="' + i + '"' +
        (i === 0 ? "" : ' aria-hidden="true" tabindex="-1"') +
        ' aria-label="' + esc((s.label ? s.label + "：" : "") + (s.title || (Array.isArray(s.sub) ? s.sub.join(" ") : s.sub) || s.cta)) + '">' +
        slideInner(s, i === 0) +
      "</a>";
    }).join("") + "</div>";

    var arrows =
      '<button class="hs-arrow hs-prev" type="button" aria-label="前のスライド">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button class="hs-arrow hs-next" type="button" aria-label="次のスライド">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';

    var dots = '<div class="hs-dots" role="tablist" aria-label="スライド選択">' +
      slides.map(function (s, i) {
        return '<button type="button" role="tab" class="hs-dot" data-i="' + i + '"' +
          (i === 0 ? ' aria-current="true"' : "") +
          ' aria-label="' + esc(s.label || ("スライド" + (i + 1))) + '"></button>';
      }).join("") + "</div>";

    el.innerHTML = track + arrows + dots;

    var slideEls = Array.prototype.slice.call(el.querySelectorAll(".hs-slide"));
    var dotEls = Array.prototype.slice.call(el.querySelectorAll(".hs-dot"));
    var cur = 0, timer = null;

    function go(i, userAction) {
      i = (i + n) % n;
      if (i === cur) { if (userAction) restart(); return; }
      slideEls[cur].classList.remove("is-active");
      slideEls[cur].setAttribute("aria-hidden", "true");
      slideEls[cur].setAttribute("tabindex", "-1");
      dotEls[cur].removeAttribute("aria-current");
      cur = i;
      slideEls[cur].classList.add("is-active");
      slideEls[cur].removeAttribute("aria-hidden");
      slideEls[cur].removeAttribute("tabindex");
      dotEls[cur].setAttribute("aria-current", "true");
      if (userAction) restart();
    }
    function next(u) { go(cur + 1, u); }
    function prev(u) { go(cur - 1, u); }

    var interval = data.autoplayMs || 7000;
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    // Auto-advance on a timer. Under prefers-reduced-motion the crossfade is
    // instant (see CSS), so slides simply swap without animation.
    function start() { if (n < 2) return; stop(); timer = setInterval(function () { next(false); }, interval); }
    function restart() { stop(); start(); }

    el.querySelector(".hs-next").addEventListener("click", function () { next(true); });
    el.querySelector(".hs-prev").addEventListener("click", function () { prev(true); });
    dotEls.forEach(function (d) {
      d.addEventListener("click", function () { go(+d.dataset.i, true); });
    });

    // pause on hover / focus within
    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", start);
    el.addEventListener("focusin", stop);
    el.addEventListener("focusout", start);

    // keyboard (when focus is inside the slider)
    el.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); next(true); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(true); }
    });

    // swipe (touch) — threshold, without hijacking vertical scroll
    var sx = 0, sy = 0, tracking = false;
    el.addEventListener("touchstart", function (e) {
      var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; tracking = true; stop();
    }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (!tracking) return; tracking = false;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        if (dx < 0) next(true); else prev(true);
      } else { start(); }
    }, { passive: true });

    // pause when tab hidden
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    start();
  }
})();
