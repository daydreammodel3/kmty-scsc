// 練習の設定と、キーボードの配置などの表。画面には触らない（テストから読み込める）。

// ---- 練習の長さ
export const TOTAL_ROUNDS = 12;        // クリック練習のラウンド数
export const MAX_PLAY_SECONDS = 90;    // クリック練習の制限時間
export const DOUBLE_TOTAL = 6;         // ダブルクリック練習の成功回数
export const DRAG_TOTAL = 5;           // ドラッグ練習の成功回数
export const KEYBOARD_TOTAL = 12;      // キーボード練習の問題数
export const COMPREHENSIVE_SECONDS = 120; // 総合演習の時間

// ダブルクリックとみなす、1回目と2回目の押下の最大間隔（ミリ秒）
export const DOUBLE_CLICK_MAX_INTERVAL_MS = 500;

// 指の名前（ガイドの文言用）
export const FINGER_LABELS = {
  "left-pinky": "左手小指",
  "left-ring": "左手薬指",
  "left-middle": "左手中指",
  "left-index": "左手人差し指",
  "left-thumb": "左手親指",
  "right-thumb": "右手親指",
  "right-index": "右手人差し指",
  "right-middle": "右手中指",
  "right-ring": "右手薬指",
  "right-pinky": "右手小指"
};

// キー → 担当する指
export const KEY_FINGERS = {
  "1": "left-pinky", "2": "left-ring", "3": "left-middle", "4": "left-index", "5": "left-index",
  "6": "right-index", "7": "right-index", "8": "right-middle", "9": "right-ring", "0": "right-pinky",
  "-": "right-pinky", "^": "right-pinky", "@": "right-pinky", "[": "right-pinky", "]": "right-pinky",
  ";": "right-pinky", ":": "right-pinky", ",": "right-middle", ".": "right-ring", "/": "right-pinky",
  "shift-left": "left-pinky", "shift-right": "right-pinky", enter: "right-pinky", backspace: "right-pinky",
  q: "left-pinky", a: "left-pinky", z: "left-pinky",
  w: "left-ring", s: "left-ring", x: "left-ring",
  e: "left-middle", d: "left-middle", c: "left-middle",
  r: "left-index", t: "left-index", f: "left-index", g: "left-index", v: "left-index", b: "left-index",
  y: "right-index", u: "right-index", h: "right-index", j: "right-index", n: "right-index", m: "right-index",
  i: "right-middle", k: "right-middle",
  o: "right-ring", l: "right-ring",
  p: "right-pinky",
  " ": "right-thumb", space: "right-thumb"
};

// 画面のキーボードの並び（日本語 JIS 配列）
export const KEYBOARD_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "^", "backspace"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "@", "["],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", ":", "]", "enter"],
  ["shift-left", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift-right"],
  ["space"]
];

// Shift と一緒に押すと出る記号（日本語 JIS 配列）。記号 → 元のキー
export const SHIFTED_CHAR_BASE = {
  "!": "1",
  "\"": "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "&": "6",
  "'": "7",
  "(": "8",
  ")": "9",
  "=": "-",
  "~": "^",
  "`": "@",
  "{": "[",
  "+": ";",
  "*": ":",
  "}": "]",
  "<": ",",
  ">": ".",
  "?": "/"
};

// 元のキー → Shift で出る記号（キートップの表示用）
export const SHIFT_LABEL_BY_KEY = Object.fromEntries(
  Object.entries(SHIFTED_CHAR_BASE).map(([symbol, base]) => [base, symbol])
);

// KPM（1分あたりに正しく打てたキーの数）の目安。ローマ字入力を想定したおおよその区切り。
// 区切りを変えるときはここだけ直す（画面下の目安の表もここから作る）。
export const KPM_LEVELS = [
  { min: 0, name: "初心者", desc: "キーボードを見ながら打っている段階" },
  { min: 100, name: "一般", desc: "普段使いなら十分" },
  { min: 200, name: "中級者", desc: "オフィス業務がスムーズ" },
  { min: 300, name: "上級者", desc: "ライター、プログラマー" },
  { min: 400, name: "プロレベル", desc: "超高速" }
];

// こどもモードの目安: 小学生向けに区切りを低くし、ひよこが育っていく名前にする。
// 「KPM」ということばは使わず、「1ぷんで うてた キーの かず」で伝える。
export const KPM_LEVELS_KIDS = [
  { min: 0, name: "たまご", desc: "まずは ゆっくり、ただしく うとう" },
  { min: 30, name: "ひよこ", desc: "キーの ばしょを おぼえてきたね" },
  { min: 60, name: "こどり", desc: "すらすら うてるように なってきたよ" },
  { min: 100, name: "わたりどり", desc: "おとなと おなじくらい はやいよ" },
  { min: 150, name: "ふくろう めいじん", desc: "すごい！ タイピングの めいじん" }
];
