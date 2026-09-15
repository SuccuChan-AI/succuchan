/* ============================================================
   SuccuChan v2 — CREATE TOGETHER (choose / reference sheets, data-driven)
   ============================================================ */
(function () {
  var chooseRoot = document.querySelector("[data-choose]");
  var refRoot = document.querySelector("[data-reference]");
  if (!chooseRoot && !refRoot) return;

  fetch("assets/data/fan-creation.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var chars = data.characters || [];
      if (chooseRoot) renderChoose(chooseRoot, chars);
      if (refRoot) renderReference(refRoot, chars);
    })
    .catch(function (e) { console.error("create-together load failed", e); });

  function renderChoose(el, chars) {
    el.innerHTML = chars.map(function (c) {
      return '<a class="fc-choose-card" href="' + c.profileHref + '" style="--mc:' + c.color + '">' +
        '<span class="fc-face"><img src="' + c.face + '" alt="' + c.name + '" loading="lazy"></span>' +
        '<span class="fc-name">' + c.name + "<i>" + c.nameJa + "</i></span>" +
        '<span class="fc-themes">' + c.themes.join("　/　") + "</span>" +
        '<span class="fc-copy">' + c.creatorCopy + "</span>" +
        '<span class="fc-profile">PROFILE <span class="arw">&rarr;</span></span>' +
      "</a>";
    }).join("");
  }

  var zoomSvg = '<svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">' +
    '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M11 8.2v5.6M8.2 11h5.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

  function renderReference(el, chars) {
    // Each sheet is self-contained (portrait / full body / specs / chibi / details).
    el.innerHTML = chars.map(function (c, i) {
      return '<button type="button" class="fc-ref-item" data-i="' + i + '" style="--mc:' + c.color + '" ' +
        'aria-label="' + c.name + '（' + c.nameJa + '）のリファレンスシートを拡大表示">' +
        '<img src="' + c.referenceImage + '" alt="' + c.name + '（' + c.nameJa + '）キャラクターリファレンスシート" ' +
          'loading="lazy" decoding="async" ' +
          'onerror="this.closest(\'.fc-ref-item\').classList.add(\'is-missing\')">' +
        '<span class="ref-ph" aria-hidden="true">' +
          '<span class="ref-ph-name">' + c.name + "</span>" +
          '<span class="ref-ph-label">Reference Sheet</span>' +
          '<span class="soon">Coming Soon</span>' +
        "</span>" +
        '<span class="ref-zoom" aria-hidden="true">' + zoomSvg + "</span>" +
      "</button>";
    }).join("");

    wireLightbox(el, chars.map(function (c) {
      return { src: c.referenceImage, name: c.name + " / " + c.nameJa };
    }));
  }

  function wireLightbox(el, items) {
    if (!items.length) return;
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.hidden = true;
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "リファレンスシート拡大表示");
    lb.innerHTML =
      '<button class="lb-close" type="button" aria-label="閉じる">&times;</button>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="前のシート">&lsaquo;</button>' +
      '<div class="lb-stage"><img alt=""><div class="lb-cap"></div></div>' +
      '<button class="lb-nav lb-next" type="button" aria-label="次のシート">&rsaquo;</button>';
    document.body.appendChild(lb);

    var img = lb.querySelector("img");
    var cap = lb.querySelector(".lb-cap");
    var cur = 0, lastFocus = null;

    function show(i) {
      cur = (i + items.length) % items.length;
      img.src = items[cur].src;
      img.alt = items[cur].name + " キャラクターリファレンスシート";
      cap.textContent = items[cur].name;
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    }
    function close() {
      lb.hidden = true;
      img.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function step(d) { show(cur + d); }

    el.querySelectorAll(".fc-ref-item").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.classList.contains("is-missing")) return;
        open(+b.dataset.i);
      });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }
})();
