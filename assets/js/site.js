/* ============================================================
   SuccuChan v2 — shared shell (header / nav / footer)
   ============================================================ */
(function () {
  var NAV = [
    { en: "TOP",          href: "index.html" },
    { en: "MEMBERS",      href: "members.html" },
    { en: "SUCCU WORLD",  href: "succu-world.html" },
    { en: "GALLERY",      href: "gallery.html" },
    { en: "DRESS UP",     href: "dress-up.html" },
    { en: "MEDIA",        href: "media.html" },
    { en: "FAN CREATION", href: "fan-creation.html" },
    { en: "ABOUT",        href: "about.html" }
  ];
  var SNS = [
    { label: "X", href: "https://x.com/SuccuChan_AI", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
    { label: "Instagram", href: "https://www.instagram.com/succuchan_ai/", d: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.77.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.77.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" },
    { label: "TikTok", href: "https://www.tiktok.com/@succuchan_ai", d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" },
    { label: "YouTube", href: "https://www.youtube.com/@SuccuChanOfficial", d: "M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" }
  ];

  var here = (location.pathname.split("/").pop() || "index.html");
  if (here === "" || here === "member.html") here = (here === "member.html" ? "members.html" : "index.html");

  function snsSvg(d) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + d + '"/></svg>';
  }

  /* ---- header ---- */
  var header = document.createElement("header");
  header.className = "site-header";
  var navLinks = NAV.map(function (n) {
    var cur = n.href === here ? ' aria-current="page"' : "";
    return '<a href="' + n.href + '"' + cur + '>' + n.en + "</a>";
  }).join("");
  header.innerHTML =
    '<div class="container">' +
      '<a class="brand" href="index.html" aria-label="SuccuChan TOP">' +
        '<img class="sym" src="assets/webp/logo_symbol.webp" alt="">' +
        '<img src="assets/webp/logo_main.webp" alt="SuccuChan">' +
      "</a>" +
      '<nav class="nav" aria-label="Global">' + navLinks + "</nav>" +
      '<button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
    "</div>";

  /* ---- mobile overlay ---- */
  var overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  overlay.innerHTML =
    NAV.map(function (n, i) {
      var cur = n.href === here ? ' aria-current="page"' : "";
      var idx = ("0" + (i + 1)).slice(-2);
      return '<a href="' + n.href + '"' + cur + '><span class="idx">' + idx + "</span>" + n.en + "</a>";
    }).join("") +
    '<div class="ov-foot">SuccuChan &mdash; 人間界って、こんなに面白い。</div>';

  /* ---- footer ---- */
  var footer = document.createElement("footer");
  footer.className = "site-footer";
  var col1 = NAV.slice(0, 4), col2 = NAV.slice(4);
  footer.innerHTML =
    '<div class="container">' +
      '<div class="f-brand">' +
        '<img src="assets/webp/logo_main_white.webp" alt="SuccuChan">' +
        '<p class="f-copy">AIから生まれた6人のキャラクターが、人間界を知り、経験していくCharacter IP。</p>' +
        '<div class="sns">' + SNS.map(function (s) {
          return '<a href="' + s.href + '" target="_blank" rel="noopener" aria-label="' + s.label + '">' + snsSvg(s.d) + "</a>";
        }).join("") + "</div>" +
      "</div>" +
      '<div><h4>Explore</h4><nav>' + col1.map(function (n) { return '<a href="' + n.href + '">' + n.en + "</a>"; }).join("") + "</nav></div>" +
      '<div><h4>More</h4><nav>' + col2.map(function (n) { return '<a href="' + n.href + '">' + n.en + "</a>"; }).join("") + "</nav></div>" +
    "</div>" +
    '<div class="container"><div class="f-bottom"><span>&copy; SuccuChan</span><span>All characters are original IP characters.</span></div></div>';

  document.body.insertBefore(header, document.body.firstChild);
  document.body.insertBefore(overlay, header.nextSibling);
  document.body.appendChild(footer);

  /* ---- interactions ---- */
  var toggle = header.querySelector(".nav-toggle");
  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    overlay.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  toggle.addEventListener("click", function () { setMenu(!document.body.classList.contains("nav-open")); });
  overlay.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
})();
