/* ============================================================
   SuccuChan v2 — ACADEMY archive (Succu Academy / Succu Animals)
   data-driven. 実データが無い間は空状態を表示し、academy.json に
   エントリを足すだけでカードが並ぶ。
   ============================================================ */
(function () {
  var root = document.querySelector("[data-academy]");
  if (!root) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  fetch("assets/data/academy.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var academy = (data.academy || []).map(function (x) { return normAcademy(x); });
      var animals = (data.animals || []).map(function (x) { return normAnimals(x); });
      build(root, academy, animals);
    })
    .catch(function (e) { console.error("academy load failed", e); });

  function normAcademy(x) {
    return {
      kind: "academy", cat: "ACADEMY",
      title: x.title || x.question || "",
      meta: [x.character, x.date].filter(Boolean).join(" ・ "),
      sub: x.question && x.title ? x.question : (x.answer || ""),
      thumbnail: x.thumbnail || "",
      tags: x.tags || [],
      date: x.date || ""
    };
  }
  function normAnimals(x) {
    return {
      kind: "animals", cat: "ANIMALS",
      title: x.animal || "",
      meta: [x.zoo, x.visitDate].filter(Boolean).join(" ・ "),
      sub: x.caption || "",
      thumbnail: x.thumbnail || "",
      tags: x.tags || [],
      date: x.visitDate || ""
    };
  }

  function cardHtml(it) {
    var thumb = it.thumbnail
      ? '<img src="' + esc(it.thumbnail) + '" alt="' + esc(it.title) + '" loading="lazy" decoding="async">'
      : '<span class="ac-ph" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>';
    var tags = (it.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    return '<article class="ac-card ac-card--' + it.kind + '">' +
      '<div class="ac-thumb">' + thumb + '<span class="ac-cat">' + esc(it.cat) + "</span></div>" +
      '<div class="ac-body">' +
        (it.title ? '<h3 class="ac-title">' + esc(it.title) + "</h3>" : "") +
        (it.meta ? '<p class="ac-meta">' + esc(it.meta) + "</p>" : "") +
        (it.sub ? '<p class="ac-sub">' + esc(it.sub) + "</p>" : "") +
        (tags ? '<ul class="ac-tags">' + tags + "</ul>" : "") +
      "</div></article>";
  }

  function build(el, academy, animals) {
    var all = academy.concat(animals).sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
    var sets = { all: all, academy: academy, animals: animals };

    var tabs = [
      { key: "all", label: "ALL" },
      { key: "academy", label: "ACADEMY" },
      { key: "animals", label: "ANIMALS" }
    ];

    el.innerHTML =
      '<div class="ac-tabs" role="tablist" aria-label="アーカイブ絞り込み">' +
        tabs.map(function (t) {
          return '<button type="button" role="tab" class="ac-tab" data-key="' + t.key + '"' +
            (t.key === "all" ? ' aria-selected="true"' : "") + ">" +
            t.label + '<span class="ac-count">' + sets[t.key].length + "</span></button>";
        }).join("") +
      "</div>" +
      '<div class="ac-grid" data-academy-grid></div>' +
      '<div class="ac-empty" data-academy-empty hidden>' +
        '<span class="ac-empty-mark">✦</span>' +
        '<p>New discoveries coming soon.</p>' +
        '<span class="ac-empty-sub">サキュアカデミー / サキュアニマルの記録は、これから少しずつ増えていきます。</span>' +
      "</div>";

    var grid = el.querySelector("[data-academy-grid]");
    var empty = el.querySelector("[data-academy-empty]");
    var tabEls = Array.prototype.slice.call(el.querySelectorAll(".ac-tab"));

    function render(key) {
      var items = sets[key] || [];
      if (!items.length) {
        grid.innerHTML = "";
        grid.hidden = true;
        empty.hidden = false;
      } else {
        grid.innerHTML = items.map(cardHtml).join("");
        grid.hidden = false;
        empty.hidden = true;
      }
    }

    tabEls.forEach(function (b) {
      b.addEventListener("click", function () {
        tabEls.forEach(function (x) { x.removeAttribute("aria-selected"); });
        b.setAttribute("aria-selected", "true");
        render(b.dataset.key);
      });
    });

    render("all");
  }
})();
