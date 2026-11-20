// 練習画面で共通に使う部品: カウントダウン・終了表示・スコア画面・ランダム配置。
import { $, randomBetween, waitMs } from "./util.js";
import { getScoreRank } from "./scoring.js";

// 練習を始めたことを、カテゴリ選択の下に出す
export function markSessionReady() {
  $("sessionText").textContent = "準備完了。演習を開始します。";
}

// 結果の一言。kind は "good" / "warning"（色とキャラクターの声かけが変わる）、省略で通常
export function setResult(el, text, kind = null) {
  el.textContent = text;
  el.className = kind ? `result score-${kind}` : "result";
}

// 3・2・1 と数えてから startMessage を出す。centerEl を渡すと、その上に大きく数字を出す
export async function runCountdown(statusEl, startMessage, centerEl = null) {
  let overlay = null;
  if (centerEl) {
    centerEl.classList.add("countdown-host");
    overlay = document.createElement("div");
    overlay.className = "countdown-overlay";
    centerEl.appendChild(overlay);
  }

  for (let sec = 3; sec >= 1; sec -= 1) {
    statusEl.textContent = `${sec}秒後に開始します...`;
    if (overlay) {
      overlay.textContent = String(sec);
    }
    await waitMs(1000);
  }

  if (overlay) {
    overlay.textContent = "START";
    await waitMs(220);
    overlay.remove();
  }

  statusEl.textContent = startMessage;
}

export function showFinishOverlay(centerEl, message = "終了", durationMs = 2000) {
  centerEl.classList.add("countdown-host");
  const activeOverlay = centerEl.querySelector(".countdown-overlay");
  if (activeOverlay) {
    activeOverlay.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = "countdown-overlay is-finish";
  overlay.textContent = message;
  centerEl.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, durationMs);
}

// ---- スコア画面（総合演習の終わりに出す）

export function closeScoreOverlay() {
  $("scoreOverlay").hidden = true;
  $("scoreOverlayBody").innerHTML = "";
}

function buildScoreOverlayHtml({ totalScore, summary, metrics, note }) {
  const metricHtml = metrics.map((metric) => `
    <div class="score-card">
      <div class="score-card-label">${metric.label}</div>
      <div class="score-card-value">${metric.value}</div>
    </div>
  `).join("");

  return `
    <div class="score-summary">
      <div class="score-total">${totalScore} 点</div>
      <div class="score-rank">ランク ${getScoreRank(totalScore)}</div>
      <div class="score-caption">${summary}</div>
    </div>
    <div class="score-grid">${metricHtml}</div>
    <div class="score-note">${note}</div>
  `;
}

// 「終了」の表示が消えるのを待ってから、スコア画面を出す
export function showScoreAfterFinish(title, scoreData, delayMs = 2000) {
  setTimeout(() => {
    $("scoreOverlayTitle").textContent = title;
    $("scoreOverlayBody").innerHTML = buildScoreOverlayHtml(scoreData);
    $("scoreOverlay").hidden = false;
  }, delayMs);
}

// ---- 練習エリアの中に、ランダムに置く

// 大きさが決まっている的（もち）を置く
export function placeSizedTarget(el, arena, size) {
  const rect = arena.getBoundingClientRect();
  const maxX = Math.max(10, rect.width - size - 10);
  const maxY = Math.max(10, rect.height - size - 10);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
}

// 要素をそのままの大きさで置く（ダブルクリックのねこ）
export function placeRandomly(el, arena, fallbackSize = 96) {
  const rect = arena.getBoundingClientRect();
  const size = el.offsetWidth || fallbackSize;
  const pad = 10;
  const maxX = Math.max(pad, Math.floor(rect.width - size - pad));
  const maxY = Math.max(pad, Math.floor(rect.height - size - pad));
  el.style.left = `${randomBetween(pad, maxX)}px`;
  el.style.top = `${randomBetween(pad, maxY)}px`;
}

// ドラッグするもの（ひよこ）と置き場所（巣）を、近すぎないように置く
export function placeDragPair(source, drop, arena) {
  const rect = arena.getBoundingClientRect();
  const sourceW = source.offsetWidth || 90;
  const sourceH = source.offsetHeight || 90;
  const dropW = drop.offsetWidth || 170;
  const dropH = drop.offsetHeight || 120;
  const pad = 12;

  let sx = 0;
  let sy = 0;
  let dx = 0;
  let dy = 0;
  let attempts = 0;

  do {
    sx = randomBetween(pad, Math.max(pad, Math.floor(rect.width - sourceW - pad)));
    sy = randomBetween(pad, Math.max(pad, Math.floor(rect.height - sourceH - pad)));
    dx = randomBetween(pad, Math.max(pad, Math.floor(rect.width - dropW - pad)));
    dy = randomBetween(pad, Math.max(pad, Math.floor(rect.height - dropH - pad)));
    attempts += 1;
  } while (Math.hypot(sx - dx, sy - dy) < 150 && attempts < 30);

  source.style.left = `${sx}px`;
  source.style.top = `${sy}px`;
  drop.style.left = `${dx}px`;
  drop.style.top = `${dy}px`;
}
