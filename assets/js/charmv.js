/* ============================================================
   SuccuChan v2 — Character MV (data: assets/data/character-mv.json)
   - member.html  [data-charmv="member"] : the current character's MV block
   - media.html   [data-charmv="all"]    : every character's MV block
   - index.html   [data-featured-mv]     : the one item marked featured
   Players are click-to-play facades (no YouTube iframe until played).
   Each version keeps its original aspect ratio (data: "aspect").
   ============================================================ */
(function () {
  var memberRoot = document.querySelector('[data-charmv="member"]');
  var allRoot = document.querySelector('[data-charmv="all"]');
  var featRoot = document.querySelector("[data-featured-mv]");
  if (!memberRoot && !allRoot && !featRoot) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function lines(s) { return esc(s).replace(/\n/g, "<br>"); }
  function ratio(aspect) {               // "4:5" -> {css:"4/5", n:0.8}
    var p = String(aspect || "16:9").split(":"), w = +p[0] || 16, h = +p[1] || 9;
    return { css: w + "/" + h, n: w / h };
  }
  function pad2(n) { return ("0" + (n || 1)).slice(-2); }
  function poster(v) { return v.poster || ("https://i.ytimg.com/vi/" + v.youtubeId + "/oar2.jpg"); }
  function ytUrl(v) {
    var r = ratio(v.aspect);
    return r.n < 1 ? "https://youtube.com/shorts/" + v.youtubeId : "https://youtu.be/" + v.youtubeId;
  }

  function player(v, id) {
    var r = ratio(v.aspect);
    return '<div class="cmv-player"' + (id ? ' id="' + id + '"' : "") + ' style="aspect-ratio:' + r.css + '">' +
      '<button type="button" class="cmv-facade" data-yt="' + esc(v.youtubeId) + '" aria-label="' + esc(v.title) + ' を再生">' +
        '<img src="' + esc(poster(v)) + '" alt="" loading="lazy" decoding="async">' +
        (v.langLabel ? '<span class="cmv-badge">' + esc(v.langLabel) + "</span>" : "") +
        '<span class="cmv-play" aria-hidden="true"></span>' +
      "</button></div>";
  }

  function block(item, m) {
    var works = item.versions.map(function (v) {
      return '<article class="cmv-work" style="--ar:' + ratio(v.aspect).n.toFixed(4) + '">' +
        player(v) +
        '<div class="cmv-cap">' +
          '<span class="cmv-lang">' + esc(v.langLabel || v.lang) + "</span>" +
          "<h3>" + esc(v.title) + "</h3>" +
          '<p class="cmv-sub">' + esc(v.subtitle) + "</p>" +
          '<p class="cmv-desc">' + lines(v.description) + "</p>" +
          '<p class="cmv-credit">' + esc(v.credits || item.credits) + "</p>" +
          '<div class="cmv-actions">' +
            '<button type="button" class="cmv-btn" data-cmv-play><span class="cmv-btn-ic" aria-hidden="true"></span>PLAY</button>' +
            '<a class="cmv-yt" href="' + esc(ytUrl(v)) + '" target="_blank" rel="noopener">YouTube <span aria-hidden="true">&#8599;</span></a>' +
          "</div>" +
        "</div></article>";
    }).join("");
    return '<div class="cmv" style="--mc:' + esc(m.color || "#c4123e") + '">' +
      '<div class="container cmv-in">' +
        '<header class="cmv-head">' +
          '<span class="cmv-eyebrow">Official MV &middot; No.' + pad2(item.number) + "</span>" +
          '<h2 class="cmv-title">' + esc(item.title) + "</h2>" +
          '<p class="cmv-series">SuccuChan Character MV &mdash; <b>' + esc(m.name || item.character.toUpperCase()) + "</b>" +
            (m.nameJa ? " <span>" + esc(m.nameJa) + "</span>" : "") + "</p>" +
          (item.credits ? '<p class="cmv-credit">' + esc(item.credits) + "</p>" : "") +
        "</header>" +
        '<div class="cmv-works">' + works + "</div>" +
      "</div></div>";
  }

  function featured(item, m) {
    var f = item.feature || {};
    var v = item.versions.filter(function (x) { return x.lang === f.version; })[0] || item.versions[0];
    var r = ratio(v.aspect);
    return '<div class="fmv" style="--mc:' + esc(m.color || "#c4123e") + '">' +
      '<span class="fmv-mark" aria-hidden="true">' + esc(f.name || m.name || "") + "</span>" +
      '<div class="container fmv-in">' +
        '<div class="fmv-text">' +
          '<span class="fmv-kicker">' + esc(f.kicker || "FEATURED MV") + "</span>" +
          '<p class="fmv-series">SuccuChan Character MV &middot; No.' + pad2(item.number) + "</p>" +
          '<h2 class="fmv-name">' + esc(f.name || m.name) + '<span class="fmv-title">' + esc(f.title || item.title) + "</span></h2>" +
          (f.copy ? '<p class="fmv-copy">' + f.copy.map(esc).join("<br>") + "</p>" : "") +
          (f.description ? '<p class="fmv-desc">' + lines(f.description) + "</p>" : "") +
          '<p class="fmv-credit">' + esc(v.credits || item.credits) + "</p>" +
          '<div class="fmv-actions">' +
            '<button type="button" class="cmv-btn cmv-btn--lg" data-cmv-play="fmv-player"><span class="cmv-btn-ic" aria-hidden="true"></span>' + esc(f.cta || "WATCH MV") + "</button>" +
            (item.versions.length > 1 ? '<a class="fmv-link" href="member.html?id=' + esc(item.character) + '#mv">日本語版・英語版を' + esc(m.name || "") + 'のページで <span aria-hidden="true">&rarr;</span></a>' : "") +
          "</div>" +
        "</div>" +
        '<div class="fmv-media" style="--ar:' + r.n.toFixed(4) + '">' + player(v, "fmv-player") + "</div>" +
      "</div></div>";
  }

  function play(facade) {
    var wrap = facade.parentNode;
    var ifr = document.createElement("iframe");
    ifr.className = "cmv-iframe";
    ifr.src = "https://www.youtube.com/embed/" + facade.getAttribute("data-yt") + "?autoplay=1&rel=0&playsinline=1";
    ifr.title = facade.getAttribute("aria-label") || "YouTube video player";
    ifr.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    ifr.setAttribute("allowfullscreen", "");
    wrap.replaceChild(ifr, facade);
  }
  document.addEventListener("click", function (e) {
    var f = e.target.closest(".cmv-facade");
    var b = e.target.closest("[data-cmv-play]");
    if (!f && b) {
      var tid = b.getAttribute("data-cmv-play");
      var box = tid ? document.getElementById(tid) : b.closest(".cmv-work") && b.closest(".cmv-work").querySelector(".cmv-player");
      f = box && box.querySelector(".cmv-facade");
      if (box && !f) return; // already playing
      if (box && box.getBoundingClientRect().top < 0) box.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (f) play(f);
  });

  Promise.all([
    fetch("assets/data/character-mv.json").then(function (r) { return r.json(); }),
    fetch("assets/data/members.json").then(function (r) { return r.json(); })
  ]).then(function (res) {
    var items = res[0].items || [], members = {};
    (res[1] || []).forEach(function (m) { members[m.id] = m; });
    function mOf(it) { return members[it.character] || {}; }

    if (memberRoot) {
      var id = (new URLSearchParams(location.search).get("id") || "").toLowerCase();
      var mine = items.filter(function (it) { return it.character === id; });
      if (mine.length) {
        memberRoot.innerHTML = mine.map(function (it) { return block(it, mOf(it)); }).join("");
        memberRoot.hidden = false;
        if (location.hash === "#mv") setTimeout(function () { memberRoot.scrollIntoView({ block: "start" }); }, 300);
      }
    }
    if (allRoot && items.length) {
      allRoot.querySelector("[data-charmv-list]").innerHTML = items.map(function (it) { return block(it, mOf(it)); }).join("");
      allRoot.hidden = false;
    }
    if (featRoot) {
      var fi = items.filter(function (it) { return it.featured; })[0];
      if (fi) { featRoot.innerHTML = featured(fi, mOf(fi)); featRoot.hidden = false; }
    }
  }).catch(function (e) { console.error("character-mv load failed", e); });
})();
