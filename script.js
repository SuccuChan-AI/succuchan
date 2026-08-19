// ============ SuccuChan Hub ============

const CHARS = {
  ray: {
    name: "RAY", jp: "レイ", color: "var(--ray)",
    catch: "優雅で面倒見の良い最年長お姉さん。",
    intro: "家庭的で観察力の高い、この家の“支柱”。料理・お花・文化に通じ、みんなの体調や気分の変化にいちばん先に気づく。支えるのは得意だけど、支えられるのは少し苦手。",
    quote: "「ふふっ、いらっしゃい。ゆっくりしていってね」",
    tags: ["家庭料理", "お花（白い薔薇）", "美術館・器・文化", "ワイン／日本酒", "ヨガ"],
    height: "167cm", bwh: "88 / 58 / 87", birthday: "6月15日",
    fun: "実は方向音痴。最近の若者言葉もちょっと苦手。",
    en: "The elegant, caring eldest sister. Loves a good drink — just can't really handle it."
  },
  mayu: {
    name: "MAYU", jp: "マユ", color: "var(--mayu)",
    catch: "いつも笑ってる食いしん坊ムードメーカー。",
    intro: "サキュちゃんの太陽。食べ物とイベントが大好きで、何にでも全力。ノリだけに見えて、好きになったものは背景まで調べる努力家。人の長所を素直に「すごい！」と言える子。",
    quote: "「ねえねえ、なんか食べに行こ！おいしいは正義だよ！」",
    tags: ["食べること", "チョコミント", "FC東京⚽", "ヤクルト⚾", "よく笑う"],
    height: "156cm", bwh: "93 / 60 / 92", birthday: "9月9日",
    fun: "猫舌でホラーが苦手。夜こわくなるとAYAを起こす。",
    en: "The sunshine of SuccuChan. Always smiling, always hungry."
  },
  aya: {
    name: "AYA", jp: "アヤ", color: "var(--aya)",
    catch: "運動とダンスが大好き。直球エネルギッシュ。",
    intro: "スポーツ万能で、「できなかったことができる瞬間」がいちばん好き。自分には厳しく、人には優しい。頑張ってる人を見ると、つい応援したくなる。",
    quote: "「よっし、今日も動くよ！一緒に走ろ！」",
    tags: ["スポーツ全般", "ヤクルト⚾", "バスケ🏀", "ダンス／チア", "ヘアアクセ集め"],
    height: "158cm", bwh: "86 / 57 / 87", birthday: "5月4日",
    fun: "絵だけは壊滅的に苦手。弱音を見せるのも苦手。",
    en: "Loves sports and dance. Straightforward and full of energy."
  },
  hika: {
    name: "HIKA", jp: "ヒカ", color: "var(--hika)",
    catch: "知性派オタク。好きな話は早口になる。",
    intro: "ハイテクと動物を、同じ知識欲で愛する知性派。エージェンティックAIを使いこなす一方で、珍しい動物を追いかけ、動物園ではカメラとフィールドノートを手放さない。普段は丁寧語。",
    quote: "「これ、いいガジェットなんですよ。…あ、ぬいぐるみも見ます…？」",
    tags: ["珍しい動物", "AI／ガジェット", "ゲーム環境構築", "ぬいぐるみ収集", "自然・保全"],
    height: "160cm", bwh: "92 / 58 / 90", birthday: "4月22日",
    fun: "動物園なら一日中歩けるのに、5分の運動には文句を言う。",
    en: "A true nerd at heart — bring up her favorite things and she starts talking fast."
  },
  koto: {
    name: "KOTO", jp: "コト", color: "var(--koto)",
    catch: "人間界にいちばん憧れる、ガーリー担当。",
    intro: "トレンド感度の高いガーリー担当スタイリスト。ファッションもスイーツも物語も大好き。みんなの服を考えるのも得意で、プチプラも組み合わせで“高見え”させてしまう。",
    quote: "「ねえ、これかわいくない？まじ神なんだけど🥺」",
    tags: ["ファッション", "スイーツ🍓", "アフタヌーンティー", "スマホ写真", "ドラマ／K-POP"],
    height: "157cm", bwh: "87 / 58 / 85", birthday: "10月10日",
    fun: "自分の服だけは決められない。写真は「あと1枚」が止まらない。",
    en: "Girly, endlessly curious — the one who adores the human world the most."
  },
  rina: {
    name: "RINA", jp: "リナ", color: "var(--rina)",
    catch: "クールに見えて実はゲーマーな音楽の天才。",
    intro: "ピアノ・作曲・DJまで何でもこなす天才肌。何でもできるからこそ、人間界でようやく“本気で夢中になれるもの”を見つけはじめた。クールに見えて、実は家いちばんの聞き上手。",
    quote: "「別に。…まあ、話くらいなら聞くけど」",
    tags: ["音楽・作曲・DJ", "ゲーム（FPS）", "STAR WARS／MCU", "マック／アイス", "シーシャ"],
    height: "162cm", bwh: "88 / 54 / 89", birthday: "11月17日",
    fun: "運動と人混みが苦手。頼まれると、つい「いいよ」。",
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
  const tags = c.tags.map(t => `<li>${t}</li>`).join("");
  modalBody.innerHTML = `
    <div class="m-head">
      <span class="m-name">${c.name}</span>
      <span class="m-jp">${c.jp}</span>
      <span class="m-bday">🎂 ${c.birthday}</span>
    </div>
    <p class="m-catch">${c.catch}</p>
    <div class="m-imgs">
      <img src="assets/webp/${key}_full.webp" alt="${c.name} 全身" loading="lazy" decoding="async">
      <img src="assets/webp/${key}_close.webp" alt="${c.name} クローズアップ" loading="lazy" decoding="async">
    </div>
    <p class="m-quote">${c.quote}</p>
    <p class="m-intro">${c.intro}</p>
    <ul class="m-tags">${tags}</ul>
    <dl class="m-stats">
      <dt>身長</dt><dd>${c.height}</dd>
      <dt>B/W/H</dt><dd>${c.bwh}</dd>
      <dt>ちょっと意外</dt><dd>${c.fun}</dd>
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
