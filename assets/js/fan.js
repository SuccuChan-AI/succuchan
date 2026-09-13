/* ============================================================
   SuccuChan v2 — FAN CREATION (choose / reference, data-driven)
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
    .catch(function (e) { console.error("fan-creation load failed", e); });

  function li(arr) { return arr.map(function (x) { return "<li>" + x + "</li>"; }).join(""); }

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

  function renderReference(el, chars) {
    el.innerHTML = chars.map(function (c) {
      var r = c.ref;
      return '<div class="fc-ref-card" style="--mc:' + c.color + '">' +
        '<div class="ref-img">' +
          '<div class="ref-ph" role="img" aria-label="' + c.name + ' キャラクターリファレンス（準備中）">' +
            '<span class="ref-ph-name">' + c.name + "</span>" +
            '<span class="ref-ph-label">Character Reference</span>' +
            '<span class="soon">Coming Soon</span>' +
          "</div>" +
          '<img src="' + c.referenceImage + '" alt="' + c.name + ' キャラクターリファレンス" hidden ' +
            'onload="this.hidden=false;this.previousElementSibling.hidden=true" onerror="this.remove()">' +
        "</div>" +
        '<div class="ref-body">' +
          '<div class="ref-head"><span class="ref-avatar"><img src="' + c.face + '" alt="" aria-hidden="true"></span>' +
            '<span class="ref-name">' + c.name + "<i>" + c.nameJa + "</i></span></div>" +
          '<dl class="ref-specs">' +
            "<dt>Hair</dt><dd>" + r.hair + "</dd>" +
            "<dt>Eyes</dt><dd>" + r.eyes + "</dd>" +
            "<dt>Horns</dt><dd>" + r.horns + "</dd>" +
            "<dt>Tail</dt><dd>" + r.tail + "</dd>" +
            "<dt>Key Features</dt><dd>" + r.features + "</dd>" +
          "</dl>" +
          '<div class="ref-tags"><span class="ref-tags-lbl">Personality</span><ul>' + li(r.personality) + "</ul></div>" +
          '<div class="ref-tags"><span class="ref-tags-lbl">Interests</span><ul>' + li(r.interests) + "</ul></div>" +
        "</div>" +
      "</div>";
    }).join("");
  }
})();
