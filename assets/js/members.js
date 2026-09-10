/* ============================================================
   SuccuChan v2 — members rendering (data-driven)
   Populates, if present:
     [data-members-preview]  -> face row (TOP)
     [data-members-grid]     -> members index cards
     [data-member-detail]    -> character detail (reads ?id=)
   ============================================================ */
(function () {
  var roots = {
    preview: document.querySelector("[data-members-preview]"),
    grid: document.querySelector("[data-members-grid]"),
    detail: document.querySelector("[data-member-detail]")
  };
  if (!roots.preview && !roots.grid && !roots.detail) return;

  fetch("assets/data/members.json")
    .then(function (r) { return r.json(); })
    .then(function (members) {
      if (roots.preview) renderPreview(roots.preview, members);
      if (roots.grid) renderGrid(roots.grid, members);
      if (roots.detail) renderDetail(roots.detail, members);
    })
    .catch(function (e) { console.error("members load failed", e); });

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function renderPreview(el, members) {
    el.innerHTML = members.map(function (m) {
      return '<a href="member.html?id=' + m.id + '" style="--mc:' + m.color + '">' +
        '<span class="face"><img src="' + m.images.face + '" alt="' + m.name + '" loading="lazy"></span>' +
        '<span class="m-en">' + m.name + '</span>' +
        '<span class="m-ja">' + m.nameJa + '</span>' +
      "</a>";
    }).join("");
  }

  function renderGrid(el, members) {
    el.innerHTML = members.map(function (m) {
      return '<a class="mcard" href="member.html?id=' + m.id + '" style="--mc:' + m.color + '">' +
        '<span class="m-accent"></span>' +
        '<span class="m-watermark" aria-hidden="true">' + m.name + '</span>' +
        '<span class="m-full"><img src="' + m.images.full + '" alt="' + m.name + ' フルボディ" loading="lazy"></span>' +
        '<span class="m-meta">' +
          '<span class="m-en">' + m.name + '</span>' +
          '<span class="m-ja">' + m.nameJa + '</span>' +
          '<span class="m-cat">' + m.category.join("　/　") + '</span>' +
        '</span>' +
      "</a>";
    }).join("");
  }

  function renderDetail(el, members) {
    var params = new URLSearchParams(location.search);
    var id = params.get("id") || members[0].id;
    var idx = members.findIndex(function (m) { return m.id === id; });
    if (idx < 0) idx = 0;
    var m = members[idx];
    var prev = members[(idx - 1 + members.length) % members.length];
    var next = members[(idx + 1) % members.length];

    document.title = m.name + " " + m.nameJa + " | SuccuChan";

    var roster = members.map(function (x, i) {
      var cur = x.id === m.id ? ' aria-current="true"' : "";
      return (i ? '<span class="sep">|</span>' : "") +
        '<a href="member.html?id=' + x.id + '"' + cur + '>' + x.name + "</a>";
    }).join("");

    var likes = m.likes.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("");
    var cat = m.category.map(function (c, i) { return (i ? ' <span class="d-cat-sep">/</span> ' : "") + (i === 0 ? "<b>" + c + "</b>" : c); }).join("");
    var explore = m.explore.map(function (x) { return '<li><a href="' + x.href + '">' + x.label + "</a></li>"; }).join("");

    el.setAttribute("style", "--mc:" + m.color + ";--accent:" + m.color + ";--accent-soft:color-mix(in srgb," + m.color + " 10%,#fff);--accent-line:color-mix(in srgb," + m.color + " 32%,#fff)");
    el.innerHTML =
      '<div class="container wide">' +
        '<div class="detail-top">' +
          '<span class="tagline">SIX GIRLS &middot; ONE HOUSE</span>' +
          '<span class="prevnext">' +
            '<a href="member.html?id=' + prev.id + '"><span class="arw">&larr;</span> PREV</a>' +
            '<a class="solid" href="member.html?id=' + next.id + '">NEXT <span class="arw">&rarr;</span></a>' +
          "</span>" +
        "</div>" +
        '<div class="detail-grid dots">' +
          '<div class="d-info">' +
            '<p class="d-quote">' + esc(m.quote) + '</p>' +
            '<h1 class="d-name">' + m.name + '</h1>' +
            '<p class="d-name-ja">' + m.nameJa + '</p>' +
            '<p class="d-cat">' + cat + '</p>' +
            '<p class="d-profile">' + esc(m.profile) + '</p>' +
            '<div class="d-info-row">' +
              '<div><span class="k">Height</span><span class="v">' + m.height + '</span></div>' +
              '<div><span class="k">Birthday</span><span class="v">' + m.birthday + '</span></div>' +
            "</div>" +
            '<ul class="d-likes">' + likes + "</ul>" +
            '<div class="d-explore"><div class="lbl">Explore ' + m.name + '</div><ul>' + explore + "</ul></div>" +
            '<div class="d-switch"><nav class="roster" aria-label="メンバー切替">' + roster + "</nav></div>" +
          "</div>" +
          '<div class="d-visual">' +
            '<span class="d-watermark" aria-hidden="true">' + m.name + '</span>' +
            '<img class="d-bust" src="' + m.images.bust + '" alt="" aria-hidden="true" loading="lazy">' +
            '<span class="d-full"><img src="' + m.images.full + '" alt="' + m.name + ' ' + m.nameJa + '"></span>' +
            '<img class="d-chibi" src="' + m.images.chibi + '" alt="" aria-hidden="true" loading="lazy">' +
            '<span class="d-script">' + esc(m.script) + '</span>' +
            '<span class="d-vtag">' + esc(m.tagline) + '</span>' +
          "</div>" +
        "</div>" +
      "</div>";
  }
})();
