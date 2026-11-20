// 練習画面の入口。各練習を組み立て、おとな／こどもの切り替えをつなぐ。
//
// 構成（training/ の下）:
//   data.js / prompts.js / romaji.js / keys.js / scoring.js  … 画面に触らないロジック（tests/unit でテスト）
//   ui.js / audience.js / keyboard-guide.js / menu.js         … 画面の共通部品
//   exercises/*.js                                            … 練習ごとの処理
//
// 練習の記録は、どこにも送らない（CSP でも connect-src 'none'）。
import { applyAudienceTexts, getAudience, setAudience } from "./audience.js";
import { followShiftKey, renderKeyboard } from "./keyboard-guide.js";
import { initMenu } from "./menu.js";
import { closeScoreOverlay } from "./ui.js";
import { $ } from "./util.js";
import { initClickExercise } from "./exercises/click.js";
import { initComprehensiveMouseExercise } from "./exercises/comp-mouse.js";
import { initDoubleClickExercise } from "./exercises/double-click.js";
import { initDragExercise } from "./exercises/drag.js";
import { initKeyboardExercise } from "./exercises/keyboard.js";

followShiftKey();
initClickExercise();
initDoubleClickExercise();
initDragExercise();
const comprehensiveMouse = initComprehensiveMouseExercise();
let menu = null;
const keyboard = initKeyboardExercise({ getCategory: () => menu.getCategory() });
menu = initMenu({ keyboard });

function applyAudience(next) {
  // 入力練習の途中では切り替えない（問題が途中で変わらないように）
  if (keyboard.isStarted()) {
    return;
  }
  const audience = setAudience(next);
  document.body.dataset.audience = audience;
  document.querySelectorAll("[data-audience-btn]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.audienceBtn === audience));
  });
  // こどもモードでは漢字の練習を出さない
  $("levelKanjiBtn").hidden = audience === "kids";
  applyAudienceTexts();
  keyboard.renderKpmScale();
  if (audience === "kids" && keyboard.getLevel() === "kanji") {
    keyboard.setLevel("hira");
  } else {
    keyboard.refreshPromptText();
  }
  // キャラクター（characters.js）などに知らせる
  document.dispatchEvent(new CustomEvent("audiencechange", { detail: { audience } }));
}

document.querySelectorAll("[data-audience-btn]").forEach((btn) => {
  btn.addEventListener("click", () => applyAudience(btn.dataset.audienceBtn));
});
$("scoreOverlayCloseBtn").addEventListener("click", closeScoreOverlay);

renderKeyboard();
keyboard.renderKpmScale();
comprehensiveMouse.hideItems();
keyboard.setLevel("hira");
applyAudience(getAudience());
