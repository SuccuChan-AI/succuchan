// ============ SuccuChan Hub ============

const CHARS = {
  ray: {
    name: "RAY", jp: "レイ", color: "var(--ray)",
    catch: "優雅で面倒見の良い最年長お姉さん。お酒は好きだが、実は弱い。",
    height: "167cm", bwh: "88 / 58 / 87",
    quote: "「ふふっ、いらっしゃい。ゆっくりしていってね」",
    likes: "お花、料理、カクテルとワイン、丁寧な暮らし",
    en: "The elegant, caring eldest sister. Loves a good drink — just can't really handle it."
  },
  mayu: {
    name: "MAYU", jp: "マユ", color: "var(--mayu)",
    catch: "サキュちゃんの太陽。いつも笑っている食いしん坊ムードメーカー。",
    height: "156cm", bwh: "93 / 60 / 92",
    quote: "「ねえねえ、なんか食べに行こ！おいしいは正義だよ！」",
    likes: "食べること全般、スイーツ、イベント、スポーツ観戦",
    en: "The sunshine of SuccuChan. Always smiling, always hungry."
  },
  aya: {
    name: "AYA", jp: "アヤ", color: "var(--aya)",
    catch: "運動とダンスが大好き。直球エネルギッシュガール。",
    height: "158cm", bwh: "86 / 57 / 87",
    quote: "「よっし、今日も動くよ！一緒に走ろ！」",
    likes: "スポーツ全般、ダンス、ジム、スポーツ観戦",
    en: "Loves sports and dance. Straightforward and full of energy."
  },
  hika: {
    name: "HIKA", jp: "ヒカ", color: "var(--hika)",
    catch: "知性派オタク。好きなものの話になると早口になる。",
    height: "160cm", bwh: "92 / 58 / 90",
    quote: "「これ、いいガジェットなんですよ。…あ、ぬいぐるみも見ます…？」",
    likes: "動物、ぬいぐるみ収集、ガジェット、研究",
    en: "A true nerd at heart — bring up her favorite things and she starts talking fast."
  },
  koto: {
    name: "KOTO", jp: "コト", color: "var(--koto)",
    catch: "好奇心旺盛で人間界にいちばん憧れる、ガーリー担当。",
    height: "157cm", bwh: "87 / 58 / 85",
    quote: "「ねえ、これかわいくない？まじ神なんだけど🥺」",
    likes: "ファッション、スイーツ、スマホ、人間界のぜんぶ",
    en: "Girly, endlessly curious — the one who adores the human world the most."
  },
  rina: {
    name: "RINA", jp: "リナ", color: "var(--rina)",
    catch: "クールに見えて実はゲーマー。楽器や作曲、音楽はなんでもできちゃう天才肌。",
    height: "162cm", bwh: "88 / 54 / 89",
    quote: "「別に。…まあ、話くらいなら聞くけど」",
    likes: "音楽（クラシック〜ロック）、楽器と作曲、ゲーム（FPS・格ゲー）、シーシャ、SF映画",
    en: "Cool on the outside, gamer on the inside. A natural-born musical genius."
  }
};

const modal = document.getElementById("charModal");
const modalBody = document.getElementById("modalBody");
const panel = modal.querySelector(".modal-panel");
let lastFocus = null;

function openModal(id) {
  const c = CHARS[id];
  if (!c) return;
  const key = c.name; // 画像ファイル名はキャラ名（大文字）
  panel.style.setProperty("--mc", c.color);
  modalBody.style.setProperty("--mc", c.color);
  modalBody.innerHTML = `
    <div class="m-head">
      <span class="m-name">${c.name}</span>
      <span class="m-jp">${c.jp}</span>
    </div>
    <p class="m-catch">${c.catch}</p>
    <div class="m-imgs">
      <img src="assets/webp/${key}_full.webp" alt="${c.name} 全身" loading="lazy" decoding="async">
      <img src="assets/webp/${key}_close.webp" alt="${c.name} クローズアップ" loading="lazy" decoding="async">
    </div>
    <p class="m-quote">${c.quote}</p>
    <dl class="m-stats">
      <dt>身長</dt><dd>${c.height}</dd>
      <dt>B/W/H</dt><dd>${c.bwh}</dd>
      <dt>好きなもの</dt><dd>${c.likes}</dd>
    </dl>
    <p class="m-en">${c.en}</p>
  `;
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll(".char-card").forEach(card => {
  card.addEventListener("click", () => openModal(card.dataset.char));
});
modal.addEventListener("click", e => {
  if (e.target.closest("[data-close]")) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// フォローセクションが見えている間は固定バーを隠す（重複表示を防ぐ）
const stickyBar = document.getElementById("stickyFollow");
const followSection = document.getElementById("follow");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(entries => {
    stickyBar.classList.toggle("hidden", entries[0].isIntersecting);
  }, { threshold: 0.25 }).observe(followSection);
}
