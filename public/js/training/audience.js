// 利用者モード: おとな（中学生以上） / こども（小学生まで）
// こどもモードでは漢字の練習を隠し、文章の問題もひらがなで見せる。
import { KPM_LEVELS, KPM_LEVELS_KIDS } from "./data.js";

const AUDIENCE_KEY = "kmty-audience";

function readAudience() {
  try {
    return localStorage.getItem(AUDIENCE_KEY) === "kids" ? "kids" : "adult";
  } catch (_err) {
    return "adult";
  }
}

let audience = readAudience();

export const getAudience = () => audience;

export function setAudience(next) {
  audience = next === "kids" ? "kids" : "adult";
  try {
    localStorage.setItem(AUDIENCE_KEY, audience);
  } catch (_err) {
    // 保存できなくても、このページを開いている間は有効
  }
  return audience;
}

// おとな / こども で文言を切り替える
export function byAudience(adultText, kidsText) {
  return audience === "kids" ? kidsText : adultText;
}

export function kpmLevels() {
  return byAudience(KPM_LEVELS, KPM_LEVELS_KIDS);
}

export function promptDisplayText(prompt) {
  return byAudience(prompt.text, prompt.hira);
}

export function formatSecPerKey(pace) {
  if (!pace) return "-";
  return byAudience(`約${pace.secPerKey.toFixed(1)}秒`, `やく${pace.secPerKey.toFixed(1)}びょう`);
}

// data-kids-text を持つ要素の文言を、いまのモードに合わせる（おとなの文言は初回に覚えておく）
export function applyAudienceTexts() {
  document.querySelectorAll("[data-kids-text]").forEach((el) => {
    if (el.dataset.adultText === undefined) {
      el.dataset.adultText = el.textContent;
    }
    el.textContent = audience === "kids" ? el.dataset.kidsText : el.dataset.adultText;
  });
}

// 入力練習の途中は切り替えられないようにする
export function lockAudienceToggle(locked) {
  document.querySelectorAll("[data-audience-btn]").forEach((btn) => {
    btn.disabled = locked;
  });
}
