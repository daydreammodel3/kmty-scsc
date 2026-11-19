// 練習カテゴリ（マウス／キーボード／総合演習）と、その中のモードの切り替え。
import { $ } from "./util.js";

const PANES = { click: "paneClick", double: "paneDouble", drag: "paneDrag", "comp-mouse": "paneComprehensiveMouse", keyboard: "paneKeyboard" };
const MOUSE_MODES = { click: "modeClickBtn", double: "modeDoubleBtn", drag: "modeDragBtn" };
const CATEGORIES = { mouse: ["catMouseBtn", "mouseSubMenu"], keyboard: ["catKeyboardBtn", "keyboardSubMenu"], comprehensive: ["catComprehensiveBtn", "comprehensiveSubMenu"] };
const COMPREHENSIVE_MODES = { "comp-mouse": "compMouseBtn", "comp-keyboard": "compKeyboardBtn" };

export function initMenu({ keyboard }) {
  let category = "mouse";
  let mouseMode = "click";               // マウスに戻ったときに開くモード
  let comprehensiveMode = "comp-mouse";  // 総合演習に戻ったときに開くモード

  // 練習の画面（pane）を切り替える
  function showPane(mode) {
    Object.entries(MOUSE_MODES).forEach(([key, id]) => $(id).classList.toggle("active", mode === key));
    Object.entries(PANES).forEach(([key, id]) => $(id).classList.toggle("active", mode === key));
    if (MOUSE_MODES[mode]) {
      mouseMode = mode;
    }
  }

  function setComprehensiveMode(mode) {
    comprehensiveMode = mode;
    Object.entries(COMPREHENSIVE_MODES).forEach(([key, id]) => $(id).classList.toggle("active", mode === key));

    if (mode === "comp-mouse") {
      keyboard.useStandardSession();
      showPane("comp-mouse");
    } else {
      keyboard.useComprehensiveSession();
      showPane("keyboard");
    }
  }

  function setCategory(next) {
    category = next;
    Object.entries(CATEGORIES).forEach(([key, [buttonId, menuId]]) => {
      $(buttonId).classList.toggle("active", next === key);
      $(menuId).style.display = next === key ? "" : "none";
    });
    if (next === "mouse") {
      keyboard.useStandardSession();
      showPane(mouseMode);
    } else if (next === "keyboard") {
      keyboard.useStandardSession();
      showPane("keyboard");
    } else {
      setComprehensiveMode(comprehensiveMode);
    }
  }

  Object.entries(CATEGORIES).forEach(([key, [buttonId]]) => $(buttonId).addEventListener("click", () => setCategory(key)));
  Object.entries(COMPREHENSIVE_MODES).forEach(([key, id]) => $(id).addEventListener("click", () => setComprehensiveMode(key)));
  Object.entries(MOUSE_MODES).forEach(([key, id]) => $(id).addEventListener("click", () => showPane(key)));

  return { getCategory: () => category };
}
