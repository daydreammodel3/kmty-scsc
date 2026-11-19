// 画面のキーボードと手の絵: 次に押すキーと指を光らせる。
import { FINGER_LABELS, KEY_FINGERS, KEYBOARD_ROWS, SHIFT_LABEL_BY_KEY } from "./data.js";
import { getTypingGuideHint } from "./keys.js";
import { $, escapeHtml } from "./util.js";

const FUNCTION_KEY_LABELS = {
  space: "Space",
  enter: "Enter",
  "shift-left": "Shift",
  "shift-right": "Shift",
  backspace: "Back"
};

function keyHtml(key) {
  const label = FUNCTION_KEY_LABELS[key];
  const isFunctionKey = Boolean(label);
  const extraClass = key === "space" ? " space" : (key === "enter" || key.startsWith("shift") || key === "backspace") ? " wide" : "";
  // 文字キーは通常の表示と、Shift を押している間の表示（記号がなければ空）を持つ
  const face = isFunctionKey
    ? label
    : `<span class="kbd-label">${escapeHtml(key.toUpperCase())}</span><span class="kbd-shift-label">${escapeHtml(SHIFT_LABEL_BY_KEY[key] || "")}</span>`;
  // キーは担当する指の色で塗る（指の絵と同じ色）
  return `<div class="kbd-key${extraClass}${isFunctionKey ? " kbd-fn" : ""}" data-key="${key}" data-finger="${KEY_FINGERS[key] || ""}">${face}</div>`;
}

export function renderKeyboard() {
  $("keyboardVisual").innerHTML = KEYBOARD_ROWS
    .map((row) => `<div class="keyboard-row">${row.map(keyHtml).join("")}</div>`)
    .join("");
}

// Shift を押している間は、キートップを Shift で出る記号に切り替える
export function followShiftKey() {
  const setShiftView = (pressed) => $("keyboardVisual").classList.toggle("is-shift", pressed);
  document.addEventListener("keydown", (e) => setShiftView(e.shiftKey));
  document.addEventListener("keyup", (e) => setShiftView(e.shiftKey));
  window.addEventListener("blur", () => setShiftView(false));
}

export function clearKeyFingerHighlight() {
  document.querySelectorAll(".kbd-key.active").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".finger.active").forEach((el) => el.classList.remove("active"));
}

// nextChars（次に打てる文字の候補）のキーと指を光らせ、guideEl に文章で出す
export function highlightKeyAndFinger(nextChars, guideEl) {
  clearKeyFingerHighlight();
  if (nextChars.length === 0) {
    guideEl.textContent = "次のキー: Enter";
    return;
  }

  const fingerSet = new Set();
  const keyLabels = [];

  nextChars.forEach((char) => {
    const hint = getTypingGuideHint(char);
    hint.keys.forEach((keyValue) => {
      document.querySelectorAll(`.kbd-key[data-key="${keyValue}"]`).forEach((el) => {
        el.classList.add("active");
      });
    });
    hint.fingers.forEach((fingerId) => {
      fingerSet.add(fingerId);
    });
    keyLabels.push(hint.label);
  });

  fingerSet.forEach((fingerId) => {
    const fingerEl = document.querySelector(`.finger[data-finger="${fingerId}"]`);
    if (fingerEl) {
      fingerEl.classList.add("active");
    }
  });

  const fingerLabels = [...fingerSet].map((id) => FINGER_LABELS[id]);
  if (keyLabels.length === 1) {
    guideEl.textContent = `次のキー: ${keyLabels[0]} / ${fingerLabels.join(" + ") || "-"}`;
    return;
  }

  guideEl.textContent = `次キー候補: ${keyLabels.join(" , ")} / ${fingerLabels.join(" , ")}`;
}
