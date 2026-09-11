/* ============================================================
   SuccuChan v2 — content pages (SUCCU WORLD 4-koma / GALLERY)
   Populates [data-comics] and [data-gallery]; shared lightbox.
   ============================================================ */
(function () {
  var comicsRoot = document.querySelector("[data-comics]");
  var galleryRoot = document.querySelector("[data-gallery]");
  if (!comicsRoot && !galleryRoot) return;

  /* ---------- shared lightbox ---------- */
  var lb = document.createElement("div");
  lb.className = "lightbox"; lb.hidden = true;
  lb.innerHTML = '<button class="lb-close" aria-label="閉じる">&times;</button>' +
    '<button class="lb-nav lb-prev" aria-label="前へ">&#8249;</button>' +
    '<div class="lb-stage"><img alt=""><p class="lb-cap"></p></div>' +
    '<button class="lb-nav lb-next" aria-label="次へ">&#8250;</button>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lb-cap");
  var lbList = [], lbIndex = 0;
  function openLb(list, i){ lbList = list; lbIndex = i; renderLb(); lb.hidden = false; document.body.style.overflow = "hidden"; }
  function renderLb(){ var it = lbList[lbIndex]; if(!it) return; lbImg.src = it.src; lbImg.alt = it.cap || ""; lbCap.textContent = it.cap || ""; lbCap.hidden = !it.cap; }
  function closeLb(){ lb.hidden = true; document.body.style.overflow = ""; lbImg.src = ""; }
  function step(d){ lbIndex = (lbIndex + d + lbList.length) % lbList.length; renderLb(); }
  lb.addEventListener("click", function(e){ if(e.target===lb || e.target.classList.contains("lb-close")) closeLb(); });
  lb.querySelector(".lb-prev").addEventListener("click", function(){ step(-1); });
  lb.querySelector(".lb-next").addEventListener("click", function(){ step(1); });
  document.addEventListener("keydown", function(e){ if(lb.hidden) return; if(e.key==="Escape") closeLb(); else if(e.key==="ArrowLeft") step(-1); else if(e.key==="ArrowRight") step(1); });

  function chips(container, values, onPick){
    container.innerHTML = values.map(function(v,i){
      return '<button class="chip"'+(i===0?' data-active':'')+' data-val="'+v.val+'">'+v.label+'</button>';
    }).join("");
    container.addEventListener("click", function(e){
      var b = e.target.closest(".chip"); if(!b) return;
      container.querySelectorAll(".chip").forEach(function(c){ c.removeAttribute("data-active"); });
      b.setAttribute("data-active",""); onPick(b.dataset.val);
    });
  }

  /* ---------- SUCCU WORLD (4-koma) ---------- */
  if (comicsRoot){
    fetch("assets/data/comics.json").then(function(r){return r.json();}).then(function(data){
      var lang = "ja";
      var filter = "all";
      var langBtn = document.querySelector("[data-lang-toggle]");
      var chipBox = document.querySelector("[data-comics-filter]");
      var chars = ["RAY","MAYU","AYA","HIKA","KOTO","RINA","NOX"];
      if (chipBox) chips(chipBox, [{val:"all",label:"ALL"}].concat(chars.map(function(c){return {val:c,label:c};})), function(v){ filter=v; render(); });

      function visible(){ return data.filter(function(c){ return filter==="all" || c.characters.indexOf(filter)>=0; }); }
      function imgOf(c){ return (lang==="en" && c.en) ? c.en : c.jp; }
      function titleOf(c){ return (lang==="en" && c.titleEn) ? c.titleEn : c.titleJa; }

      function render(){
        var list = visible();
        comicsRoot.innerHTML = list.map(function(c,i){
          return '<button class="comic-card" data-i="'+i+'">' +
            '<span class="comic-pic"><img src="'+imgOf(c)+'" alt="'+titleOf(c)+'" loading="lazy"></span>' +
            '<span class="comic-cap"><span class="comic-title">'+titleOf(c)+'</span>' +
            '<span class="comic-meta">'+c.date+'　'+c.characters.join(" × ")+'</span></span></button>';
        }).join("");
        comicsRoot.querySelectorAll(".comic-card").forEach(function(card){
          card.addEventListener("click", function(){
            var lbItems = list.map(function(c){ return { src: imgOf(c), cap: titleOf(c)+"  /  "+c.date }; });
            openLb(lbItems, +card.dataset.i);
          });
        });
      }
      if (langBtn){
        langBtn.addEventListener("click", function(){
          lang = lang==="ja" ? "en" : "ja";
          langBtn.textContent = lang==="ja" ? "EN" : "JP";
          langBtn.setAttribute("aria-label", lang==="ja" ? "英語に切替" : "日本語に切替");
          render();
        });
      }
      render();
    }).catch(function(e){ console.error("comics load failed", e); });
  }

  /* ---------- GALLERY ---------- */
  if (galleryRoot){
    fetch("assets/data/gallery.json").then(function(r){return r.json();}).then(function(data){
      var filter = "all";
      var chipBox = document.querySelector("[data-gallery-filter]");
      var order = ["ray","mayu","aya","hika","koto","rina"];
      var present = order.filter(function(c){ return data.some(function(g){return g.character===c;}); });
      if (chipBox) chips(chipBox, [{val:"all",label:"ALL"}].concat(present.map(function(c){return {val:c,label:c.toUpperCase()};})), function(v){ filter=v; render(); });

      function visible(){ return data.filter(function(g){ return filter==="all" || g.character===filter; }); }
      function render(){
        var list = visible();
        galleryRoot.innerHTML = list.map(function(g,i){
          return '<button class="g-item" data-i="'+i+'"><img src="'+g.image+'" alt="'+g.character.toUpperCase()+'" loading="lazy"></button>';
        }).join("");
        galleryRoot.querySelectorAll(".g-item").forEach(function(it){
          it.addEventListener("click", function(){
            var lbItems = list.map(function(g){ return { src: g.image, cap: "" }; });
            openLb(lbItems, +it.dataset.i);
          });
        });
      }
      render();
    }).catch(function(e){ console.error("gallery load failed", e); });
  }
})();
