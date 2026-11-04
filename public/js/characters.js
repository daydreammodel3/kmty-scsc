// Small, Cute, Stylized Characters — すべてこのサイトのために描いたオリジナルのSVG。
// 練習ロジック（basic_ops_training.js）には手を入れず、要素の中身と見た目だけを差し替える。
(function () {
  const INK = "#3a2c25";
  const BLUSH = "#ffb3b8";

  const face = (lx, rx, y, mouthY, open = true) => `
    ${open
      ? `<circle cx="${lx}" cy="${y}" r="4.2" fill="${INK}"/><circle cx="${rx}" cy="${y}" r="4.2" fill="${INK}"/>
         <circle cx="${lx + 1.4}" cy="${y - 1.4}" r="1.3" fill="#fff"/><circle cx="${rx + 1.4}" cy="${y - 1.4}" r="1.3" fill="#fff"/>`
      : `<path d="M${lx - 5} ${y} q5 4 10 0 M${rx - 5} ${y} q5 4 10 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`}
    <ellipse cx="${lx - 7}" cy="${y + 8}" rx="5.5" ry="3.5" fill="${BLUSH}" opacity=".85"/>
    <ellipse cx="${rx + 7}" cy="${y + 8}" rx="5.5" ry="3.5" fill="${BLUSH}" opacity=".85"/>
    ${mouthY == null ? "" : `<path d="M${(lx + rx) / 2 - 4} ${mouthY} q4 4 8 0" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`}`;

  // もち: クリックの的。色ちがいが4種類。
  const MOCHI_COLORS = [
    { body: "#fffaf2", edge: "#e8cfb2", leaf: "#7cc47f" },
    { body: "#ffe4ea", edge: "#eab3c0", leaf: "#7cc47f" },
    { body: "#e6f4d8", edge: "#a9cf8f", leaf: "#5aa45e" },
    { body: "#fbecc8", edge: "#ddbb78", leaf: "#7cc47f" }
  ];
  const mochi = (v = 0) => {
    const c = MOCHI_COLORS[v % MOCHI_COLORS.length];
    return `<svg class="chara-svg" viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="50" cy="92" rx="30" ry="5" fill="#000" opacity=".12"/>
      <path d="M50 22 C 86 22 94 50 92 66 C 90 84 72 90 50 90 C 28 90 10 84 8 66 C 6 50 14 22 50 22 Z" fill="${c.body}" stroke="${c.edge}" stroke-width="3"/>
      <ellipse cx="34" cy="38" rx="10" ry="5" fill="#fff" opacity=".8" transform="rotate(-20 34 38)"/>
      <path d="M50 23 C 49 15 50 11 52 8" stroke="${c.leaf}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M52 9 C 60 3 70 6 70 12 C 63 16 56 14 52 9 Z" fill="${c.leaf}"/>
      ${face(37, 63, 58, 68)}
    </svg>`;
  };

  // ねこ: ダブルクリックで目をさます。
  const neko = (awake) => `<svg class="chara-svg" viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="50" cy="90" rx="34" ry="5" fill="#000" opacity=".12"/>
      <path d="M22 40 L 26 16 L 42 30 Z M78 40 L 74 16 L 58 30 Z" fill="#f6b26b" stroke="#d48a3c" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M27 34 L 29 22 L 37 30 Z M73 34 L 71 22 L 63 30 Z" fill="#ffd7c2"/>
      <ellipse cx="50" cy="56" rx="38" ry="32" fill="#f9c98c" stroke="#d48a3c" stroke-width="2.5"/>
      <path d="M38 28 q3 6 0 10 M50 25 q3 6 0 10 M62 28 q3 6 0 10" stroke="#e39a4f" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${face(37, 63, 55, 66, awake)}
      <path d="M44 63 l6 3 l6 -3" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>
      ${awake
        ? `<g class="chara-mark"><path d="M86 8 v14" stroke="#e8505b" stroke-width="5" stroke-linecap="round"/><circle cx="86" cy="30" r="3" fill="#e8505b"/></g>`
        : `<g class="chara-zzz" fill="#7a8db0" font-weight="bold" font-family="sans-serif"><text x="78" y="22" font-size="14">z</text><text x="88" y="10" font-size="10">z</text></g>`}
    </svg>`;

  // ひよこ: ドラッグしておうち（巣）まで運ぶ。
  const hiyoko = () => `<svg class="chara-svg" viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="50" cy="92" rx="28" ry="5" fill="#000" opacity=".12"/>
      <path d="M48 18 q-4 -8 2 -10 q0 6 4 8" fill="#ffd84d" stroke="#e0b21f" stroke-width="2"/>
      <circle cx="50" cy="56" r="36" fill="#ffe066" stroke="#e0b21f" stroke-width="3"/>
      <ellipse cx="22" cy="62" rx="9" ry="13" fill="#ffd23f" stroke="#e0b21f" stroke-width="2.5" transform="rotate(25 22 62)"/>
      <ellipse cx="78" cy="62" rx="9" ry="13" fill="#ffd23f" stroke="#e0b21f" stroke-width="2.5" transform="rotate(-25 78 62)"/>
      ${face(38, 62, 50, null)}
      <path d="M44 60 L 56 60 L 50 69 Z" fill="#ff9a3c" stroke="#e07a1f" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;

  const nest = () => `<svg class="nest-svg" viewBox="0 0 160 70" aria-hidden="true">
      <path d="M10 22 Q 80 6 150 22 Q 146 62 80 64 Q 14 62 10 22 Z" fill="#c8915a" stroke="#9a6534" stroke-width="3"/>
      <path d="M18 30 q30 10 60 4 q30 -6 64 2 M22 44 q28 8 58 2 q28 -6 56 0 M40 56 q20 4 40 0 q20 -4 36 0" stroke="#9a6534" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="80" cy="22" rx="62" ry="8" fill="#7a4f2a" opacity=".55"/>
    </svg>`;

  // ふくろう先生: キーボードのガイド役。
  const owl = (mood = "") => `<svg class="chara-svg" viewBox="0 0 100 100" aria-hidden="true">
      <ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".12"/>
      <path d="M22 30 L 20 10 L 38 22 Z M78 30 L 80 10 L 62 22 Z" fill="#8f7fb8" stroke="#6b5c94" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M50 16 C 82 16 88 44 86 64 C 84 86 68 92 50 92 C 32 92 16 86 14 64 C 12 44 18 16 50 16 Z" fill="#a597cf" stroke="#6b5c94" stroke-width="3"/>
      <ellipse cx="50" cy="68" rx="22" ry="20" fill="#efe8ff"/>
      <path d="M38 64 q4 3 8 0 M54 64 q4 3 8 0 M44 74 q4 3 8 0" stroke="#c9bdea" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="35" cy="42" r="13" fill="#fff" stroke="#6b5c94" stroke-width="2.5"/>
      <circle cx="65" cy="42" r="13" fill="#fff" stroke="#6b5c94" stroke-width="2.5"/>
      ${mood === "oops"
        ? `<path d="M29 42 h12 M59 42 h12" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
        : `<circle cx="36" cy="43" r="5" fill="${INK}"/><circle cx="64" cy="43" r="5" fill="${INK}"/><circle cx="38" cy="41" r="1.6" fill="#fff"/><circle cx="66" cy="41" r="1.6" fill="#fff"/>`}
      <path d="M46 50 L 54 50 L 50 57 Z" fill="#ffb347" stroke="#e08a1f" stroke-width="1.8" stroke-linejoin="round"/>
      <ellipse cx="22" cy="54" rx="4.5" ry="3" fill="${BLUSH}" opacity=".85"/><ellipse cx="78" cy="54" rx="4.5" ry="3" fill="${BLUSH}" opacity=".85"/>
    </svg>`;

  window.SCSC = { mochi, neko, hiyoko, nest, owl };

  const $ = (id) => document.getElementById(id);

  // --- マウス練習の的をキャラクターにする
  let mochiVariant = 0;
  ["target", "compMouseTarget"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.classList.add("chara", "chara-mochi");
    el.innerHTML = mochi(0);
    // 当てるたびに色ちがいのもちに交代する（表示が消えたあとに差し替える）
    el.addEventListener("click", () => {
      mochiVariant += 1;
      setTimeout(() => { el.innerHTML = mochi(mochiVariant); }, 120);
    });
  });

  ["doubleIcon", "compMouseDoubleIcon"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.classList.add("chara", "chara-neko");
    el.innerHTML = neko(false);
    let timer = null;
    el.addEventListener("dblclick", () => {
      el.innerHTML = neko(true);
      el.classList.add("is-happy");
      clearTimeout(timer);
      timer = setTimeout(() => { el.innerHTML = neko(false); el.classList.remove("is-happy"); }, 700);
    });
  });

  ["dragItem", "compMouseDragItem"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.classList.add("chara", "chara-hiyoko");
    el.innerHTML = hiyoko();
  });

  ["dropZone", "compMouseDropZone"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.classList.add("nest-zone");
    el.innerHTML = `${nest()}<span class="nest-label">ひよこのおうち<br>ここに運んでね</span>`;
  });

  // --- キーボード: ふくろう先生が「次のキー」を吹き出しで教える
  const guide = $("typingGuideText");
  if (guide) {
    const box = document.createElement("div");
    box.className = "owl-guide";
    box.innerHTML = `<div class="owl-guide-chara">${owl()}</div><div class="owl-guide-bubble" aria-hidden="true"></div>`;
    guide.insertAdjacentElement("afterend", box);
    const bubble = box.querySelector(".owl-guide-bubble");
    const sync = () => { bubble.textContent = guide.textContent; };
    sync();
    new MutationObserver(sync).observe(guide, { childList: true, characterData: true, subtree: true });

    const input = $("typingInput");
    if (input) {
      new MutationObserver(() => {
        const oops = input.classList.contains("is-error");
        box.querySelector(".owl-guide-chara").innerHTML = owl(oops ? "oops" : "");
        box.classList.toggle("is-oops", oops);
      }).observe(input, { attributes: true, attributeFilter: ["class"] });
    }
  }

  // --- 結果メッセージに合わせて、なかまが声をかける（画面右下）
  const toast = document.createElement("div");
  toast.className = "chara-toast";
  toast.setAttribute("aria-hidden", "true");
  document.body.appendChild(toast);
  const CHEERS = ["やったね！", "じょうず！", "その調子！", "いいかんじ！"];
  const COMFORT = ["だいじょうぶ、もう一回！", "ゆっくりでいいよ", "あわてなくて平気！"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const makers = [() => mochi(mochiVariant), () => neko(true), hiyoko, () => owl()];
  let toastTimer = null;
  const showToast = (good) => {
    toast.innerHTML = `<div class="chara-toast-chara">${good ? pick(makers)() : owl()}</div><div class="chara-toast-bubble">${good ? pick(CHEERS) : pick(COMFORT)}</div>`;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 1800);
  };
  document.querySelectorAll(".result").forEach((el) => {
    new MutationObserver(() => {
      if (!el.textContent.trim()) return;
      if (el.classList.contains("score-good")) showToast(true);
      else if (el.classList.contains("score-warning")) showToast(false);
    }).observe(el, { attributes: true, attributeFilter: ["class"], childList: true });
  });

  // --- スコア画面の上に、なかまたちを並べる
  const dialog = document.querySelector(".score-dialog");
  if (dialog) {
    const row = document.createElement("div");
    row.className = "chara-row chara-row-score";
    row.innerHTML = [mochi(1), neko(true), hiyoko(), owl()].map((svg) => `<span class="chara-row-item">${svg}</span>`).join("");
    dialog.prepend(row);
  }

  // --- ヘッダーとトップのキャラクター紹介
  document.querySelectorAll("[data-chara]").forEach((el) => {
    const make = { mochi: () => mochi(Number(el.dataset.variant || 0)), neko: () => neko(el.dataset.awake === "1"), hiyoko, owl };
    const fn = make[el.dataset.chara];
    if (fn) el.innerHTML = fn();
  });
})();
