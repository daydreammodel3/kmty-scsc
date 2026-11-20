// 次に打つ文字から、押すキーと指を求める。画面には触らない。
import { KEY_FINGERS, SHIFTED_CHAR_BASE } from "./data.js";

// keys: 光らせるキー / fingers: 光らせる指 / label: ガイドに出すキーの名前
export function getTypingGuideHint(char) {
  if (char === " ") {
    return { keys: ["space"], fingers: ["right-thumb"], label: "Space" };
  }

  if (SHIFTED_CHAR_BASE[char]) {
    const base = SHIFTED_CHAR_BASE[char];
    // Shift は、文字を打つ手と反対側の手の小指で押す
    const baseFinger = KEY_FINGERS[base] || "";
    const shiftKey = baseFinger.startsWith("left") ? "shift-right" : "shift-left";
    const fingers = [KEY_FINGERS[shiftKey], baseFinger].filter(Boolean);
    const shiftLabel = shiftKey === "shift-right" ? "右Shift" : "左Shift";
    return { keys: [base, shiftKey], fingers, label: `${shiftLabel} + ${base.toUpperCase()}` };
  }

  const key = char.toLowerCase();
  if (/^[a-z0-9]$/.test(key) || KEY_FINGERS[key]) {
    return {
      keys: [key],
      fingers: [KEY_FINGERS[key]].filter(Boolean),
      label: key === "space" ? "Space" : key.toUpperCase()
    };
  }

  return { keys: [key], fingers: [], label: char };
}
