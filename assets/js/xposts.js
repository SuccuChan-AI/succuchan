/* ============================================================
   SuccuChan v2 — HOME "LATEST ON X" (hand-picked posts)
   - posts are listed in assets/data/x-posts.json (max 3)
   - X's widgets.js is loaded only when the section scrolls near the
     viewport, so the TOP page stays light
   - before/without widgets.js each post shows as a plain link card
   ============================================================ */
(function () {
  var sec = document.querySelector("[data-xposts]");
  if (!sec) return;
  var grid = sec.querySelector("[data-xposts-grid]");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  // the embed widget expects twitter.com status URLs
  function toEmbedUrl(u) {
    return String(u).trim().replace(/^https?:\/\/(www\.|mobile\.)?x\.com\//i, "https://twitter.com/");
  }

  fetch("assets/data/x-posts.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var posts = (data.posts || []).filter(Boolean).slice(0, 3);
      if (!posts.length) return; // nothing to show: keep the section hidden

      var more = sec.querySelector("[data-xposts-more]");
      if (more && data.profile) more.href = data.profile;

      grid.innerHTML = posts.map(function (u) {
        return '<div class="x-post">' +
          '<blockquote class="twitter-tweet" data-dnt="true" data-lang="ja" data-conversation="none">' +
            '<a href="' + esc(toEmbedUrl(u)) + '">Xでこのポストを見る</a>' +
          "</blockquote></div>";
      }).join("");
      sec.hidden = false;
      lazyLoadWidgets();
    })
    .catch(function (e) { console.error("x-posts load failed", e); });

  function loadWidgets() {
    if (window.twttr && window.twttr.widgets) { window.twttr.widgets.load(sec); return; }
    if (document.querySelector('script[src*="platform.twitter.com/widgets.js"]')) return;
    var s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.charset = "utf-8";
    document.body.appendChild(s);
  }
  function lazyLoadWidgets() {
    if (!("IntersectionObserver" in window)) { loadWidgets(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        io.disconnect();
        loadWidgets();
      }
    }, { rootMargin: "400px 0px" });
    io.observe(sec);
  }
})();
