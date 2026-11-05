const TOTAL_ROUNDS = 12;
const MAX_PLAY_SECONDS = 90;
const DOUBLE_TOTAL = 6;
const DRAG_TOTAL = 5;
const COMPREHENSIVE_SECONDS = 120;

const KEYBOARD_TOTAL = 12;

const getKeyboardTotal = () => KEYBOARD_TOTAL;

const startBtn = document.getElementById("startBtn");
const catMouseBtn = document.getElementById("catMouseBtn");
const catKeyboardBtn = document.getElementById("catKeyboardBtn");
const catComprehensiveBtn = document.getElementById("catComprehensiveBtn");
const mouseSubMenu = document.getElementById("mouseSubMenu");
const keyboardSubMenu = document.getElementById("keyboardSubMenu");
const comprehensiveSubMenu = document.getElementById("comprehensiveSubMenu");
const compMouseBtn = document.getElementById("compMouseBtn");
const compKeyboardBtn = document.getElementById("compKeyboardBtn");
const modeClickBtn = document.getElementById("modeClickBtn");
const modeDoubleBtn = document.getElementById("modeDoubleBtn");
const modeDragBtn = document.getElementById("modeDragBtn");
const paneClick = document.getElementById("paneClick");
const paneDouble = document.getElementById("paneDouble");
const paneDrag = document.getElementById("paneDrag");
const paneComprehensiveMouse = document.getElementById("paneComprehensiveMouse");
const paneKeyboard = document.getElementById("paneKeyboard");

const phaseText = document.getElementById("phaseText");
const statusText = document.getElementById("statusText");
const sessionText = document.getElementById("sessionText");
const roundMetric = document.getElementById("roundMetric");
const missMetric = document.getElementById("missMetric");
const avgMetric = document.getElementById("avgMetric");
const bestMetric = document.getElementById("bestMetric");
const scoreMetric = document.getElementById("scoreMetric");
const comboMetric = document.getElementById("comboMetric");
const timeMetric = document.getElementById("timeMetric");
const progressBar = document.getElementById("progressBar");
const resultText = document.getElementById("resultText");

const doubleIcon = document.getElementById("doubleIcon");
const doubleArena = document.getElementById("doubleArena");
const doubleStartBtn = document.getElementById("doubleStartBtn");
const doubleStatus = document.getElementById("doubleStatus");
const doubleRoundMetric = document.getElementById("doubleRoundMetric");
const doubleMissMetric = document.getElementById("doubleMissMetric");
const doubleAvgMetric = document.getElementById("doubleAvgMetric");
const doubleResult = document.getElementById("doubleResult");

const dragItem = document.getElementById("dragItem");
const dragArena = document.getElementById("dragArena");
const dragSourceWrap = document.getElementById("dragSourceWrap");
const dropZone = document.getElementById("dropZone");
const dragStartBtn = document.getElementById("dragStartBtn");
const dragStatus = document.getElementById("dragStatus");
const dragRoundMetric = document.getElementById("dragRoundMetric");
const dragMissMetric = document.getElementById("dragMissMetric");
const dragTimeMetric = document.getElementById("dragTimeMetric");
const dragResult = document.getElementById("dragResult");

const compMouseStartBtn = document.getElementById("compMouseStartBtn");
const compMousePhaseText = document.getElementById("compMousePhaseText");
const compMouseStatus = document.getElementById("compMouseStatus");
const compMouseArena = document.getElementById("compMouseArena");
const compMouseTarget = document.getElementById("compMouseTarget");
const compMouseDoubleIcon = document.getElementById("compMouseDoubleIcon");
const compMouseDragSourceWrap = document.getElementById("compMouseDragSourceWrap");
const compMouseDragItem = document.getElementById("compMouseDragItem");
const compMouseDropZone = document.getElementById("compMouseDropZone");
const compMouseTimeMetric = document.getElementById("compMouseTimeMetric");
const compMouseRoundMetric = document.getElementById("compMouseRoundMetric");
const compMouseMissMetric = document.getElementById("compMouseMissMetric");
const compMouseResult = document.getElementById("compMouseResult");

const keyboardStartBtn = document.getElementById("keyboardStartBtn");
const keyboardStatus = document.getElementById("keyboardStatus");
const typingPromptText = document.getElementById("typingPromptText");
const typingPromptHira = document.getElementById("typingPromptHira");
const typingPromptRoma = document.getElementById("typingPromptRoma");
const typingInput = document.getElementById("typingInput");
const typingGuideText = document.getElementById("typingGuideText");
const keyboardVisual = document.getElementById("keyboardVisual");
const typingArea = document.querySelector("#paneKeyboard .typing-area");
const keyboardLevelButtons = document.querySelectorAll(".level-btn");
const typingRoundMetric = document.getElementById("typingRoundMetric");
const typingMissMetric = document.getElementById("typingMissMetric");
const typingAvgMetric = document.getElementById("typingAvgMetric");
const typingResult = document.getElementById("typingResult");
const scoreOverlay = document.getElementById("scoreOverlay");
const scoreOverlayTitle = document.getElementById("scoreOverlayTitle");
const scoreOverlayBody = document.getElementById("scoreOverlayBody");
const scoreOverlayCloseBtn = document.getElementById("scoreOverlayCloseBtn");

const arena = document.getElementById("arena");
const target = document.getElementById("target");


let round = 0;
let missClicks = 0;
let started = false;
let targetShownAt = null;
let reactionTimes = [];
let score = 0;
let combo = 0;
let currentConfig = null;
let moveTimer = null;
let playStartedAt = null;
let timeTicker = null;

let currentExerciseId = "basic_ops_click_01";

let doubleStarted = false;
let doubleSuccess = 0;
let doubleMiss = 0;
let doubleIntervals = [];
let lastDoubleDownAt = null;

let dragStarted = false;
let dragSuccess = 0;
let dragMiss = 0;
let dragTimes = [];
let dragRoundStartedAt = null;
let dragDroppedInZone = false;

let keyboardStarted = false;

// ---- 利用者モード: おとな（中学生以上） / こども（小学生まで）
// こどもモードでは漢字の練習を隠し、文章の問題もひらがなで見せる。
const AUDIENCE_KEY = "kmty-audience";
let audience = readAudience();

function readAudience() {
  try {
    return localStorage.getItem(AUDIENCE_KEY) === "kids" ? "kids" : "adult";
  } catch (_err) {
    return "adult";
  }
}

function promptDisplayText(prompt) {
  return audience === "kids" ? prompt.hira : prompt.text;
}
let keyboardSuccess = 0;
let keyboardMiss = 0;
let keyboardTimes = [];
let keyboardRoundStartedAt = null;
let keyboardTimer = null;
let keyboardEndsAt = null;
let selectedKeyboardLevel = "hira";
let currentPrompt = null;
let currentPromptTokens = [];
let currentPromptRoma = "";
let lastValidTypingInput = "";

let currentCategory = "mouse";
let currentComprehensiveMode = "comp-mouse";
let keyboardSessionMode = "standard";
let keyboardCorrectChars = 0;
let keyboardDurationSeconds = COMPREHENSIVE_SECONDS;

let compMouseStarted = false;
let compMouseSuccess = 0;
let compMouseMiss = 0;
let compMouseActionTimes = [];
let compMouseMode = null;
let compMouseTimer = null;
let compMouseEndsAt = null;
let compMouseDurationSeconds = COMPREHENSIVE_SECONDS;
let compMouseRoundStartedAt = null;
let compMouseLastDoubleDownAt = null;
let compMouseDragDropped = false;

const keyboardLevelLabels = {
  hira: "ひらがな",
  kanji: "漢字単語",
  symbol: "記号入力",
  sentence: "日本語文章"
};

const keyboardSamplesByLevel = {
  hira: [
    { text: "あ", hira: "あ" },
    { text: "い", hira: "い" },
    { text: "う", hira: "う" },
    { text: "え", hira: "え" },
    { text: "お", hira: "お" },
    { text: "か", hira: "か" },
    { text: "き", hira: "き" },
    { text: "く", hira: "く" },
    { text: "け", hira: "け" },
    { text: "こ", hira: "こ" },
    { text: "さ", hira: "さ" },
    { text: "し", hira: "し" },
    { text: "す", hira: "す" },
    { text: "せ", hira: "せ" },
    { text: "そ", hira: "そ" },
    { text: "た", hira: "た" },
    { text: "ち", hira: "ち" },
    { text: "つ", hira: "つ" },
    { text: "て", hira: "て" },
    { text: "と", hira: "と" },
    { text: "な", hira: "な" },
    { text: "に", hira: "に" },
    { text: "ぬ", hira: "ぬ" },
    { text: "ね", hira: "ね" },
    { text: "の", hira: "の" },
    { text: "は", hira: "は" },
    { text: "ひ", hira: "ひ" },
    { text: "ふ", hira: "ふ" },
    { text: "へ", hira: "へ" },
    { text: "ほ", hira: "ほ" },
    { text: "ま", hira: "ま" },
    { text: "み", hira: "み" },
    { text: "む", hira: "む" },
    { text: "め", hira: "め" },
    { text: "も", hira: "も" },
    { text: "や", hira: "や" },
    { text: "ゆ", hira: "ゆ" },
    { text: "よ", hira: "よ" },
    { text: "ら", hira: "ら" },
    { text: "り", hira: "り" },
    { text: "る", hira: "る" },
    { text: "れ", hira: "れ" },
    { text: "ろ", hira: "ろ" },
    { text: "わ", hira: "わ" },
    { text: "を", hira: "を" },
    { text: "ん", hira: "ん" },
    { text: "さくら", hira: "さくら" },
    { text: "すいか", hira: "すいか" },
    { text: "たぬき", hira: "たぬき" },
    { text: "きつね", hira: "きつね" },
    { text: "うさぎ", hira: "うさぎ" },
    { text: "くるま", hira: "くるま" },
    { text: "でんわ", hira: "でんわ" },
    { text: "てがみ", hira: "てがみ" },
    { text: "とまと", hira: "とまと" },
    { text: "りんご", hira: "りんご" },
    { text: "ばなな", hira: "ばなな" },
    { text: "めろん", hira: "めろん" },
    { text: "みかん", hira: "みかん" },
    { text: "おちゃ", hira: "おちゃ" },
    { text: "めだか", hira: "めだか" },
    { text: "はさみ", hira: "はさみ" },
    { text: "えんぴつ", hira: "えんぴつ" },
    { text: "かばん", hira: "かばん" },
    { text: "ぼうし", hira: "ぼうし" },
    { text: "めがね", hira: "めがね" }
  ],
  kanji: [
    { text: "学校", hira: "がっこう" },
    { text: "図書館", hira: "としょかん" },
    { text: "新幹線", hira: "しんかんせん" },
    { text: "情報", hira: "じょうほう" },
    { text: "暗号", hira: "あんごう" },
    { text: "防災", hira: "ぼうさい" },
    { text: "健康", hira: "けんこう" },
    { text: "安全", hira: "あんぜん" },
    { text: "家族", hira: "かぞく" },
    { text: "友達", hira: "ともだち" },
    { text: "天気", hira: "てんき" },
    { text: "季節", hira: "きせつ" },
    { text: "春", hira: "はる" },
    { text: "夏", hira: "なつ" },
    { text: "秋", hira: "あき" },
    { text: "冬", hira: "ふゆ" },
    { text: "山", hira: "やま" },
    { text: "川", hira: "かわ" },
    { text: "海", hira: "うみ" },
    { text: "森", hira: "もり" },
    { text: "食べ物", hira: "たべもの" },
    { text: "野菜", hira: "やさい" },
    { text: "果物", hira: "くだもの" },
    { text: "肉", hira: "にく" },
    { text: "魚", hira: "さかな" },
    { text: "水", hira: "みず" },
    { text: "飲み物", hira: "のみもの" },
    { text: "言葉", hira: "ことば" },
    { text: "文字", hira: "もじ" },
    { text: "本", hira: "ほん" },
    { text: "新聞", hira: "しんぶん" },
    { text: "手紙", hira: "てがみ" },
    { text: "携帯", hira: "けいたい" },
    { text: "電話", hira: "でんわ" },
    { text: "時間", hira: "じかん" },
    { text: "時計", hira: "とけい" },
    { text: "朝", hira: "あさ" },
    { text: "昼", hira: "ひる" },
    { text: "夜", hira: "よる" },
    { text: "仕事", hira: "しごと" },
    { text: "勉強", hira: "べんきょう" },
    { text: "学習", hira: "がくしゅう" },
    { text: "練習", hira: "れんしゅう" },
    { text: "試験", hira: "しけん" },
    { text: "成功", hira: "せいこう" },
    { text: "失敗", hira: "しっぱい" },
    { text: "努力", hira: "どりょく" },
    { text: "頑張る", hira: "がんばる" },
    { text: "楽しい", hira: "たのしい" },
    { text: "嬉しい", hira: "うれしい" }
  ],
  symbol: [
    { text: "。", hira: "。" },
    { text: "、", hira: "、" },
    { text: "！", hira: "！" },
    { text: "？", hira: "？" },
    { text: "「", hira: "「" },
    { text: "」", hira: "」" },
    { text: "（", hira: "（" },
    { text: "）", hira: "）" },
    { text: "・", hira: "・" },
    { text: "ー", hira: "ー" },
    { text: "～", hira: "～" }
  ],
  sentence: [
    { text: "今日はいい天気です。", hira: "きょうはいいてんきです。" },
    { text: "明日は雨が降ります！", hira: "あしたはあめがふります！" },
    { text: "私は学生です。", hira: "わたしはがくせいです。" },
    { text: "電車で会社に行きます。", hira: "でんしゃでかいしゃにいきます。" },
    { text: "「おはよう」と言いました。", hira: "「おはよう」といいました。" },
    { text: "昨日は友だちと会いました。", hira: "きのうはともだちとあいました。" },
    { text: "毎朝コーヒーを飲みます。", hira: "まいあさこーひーをのみます。" },
    { text: "この本はとても面白いです！", hira: "このほんはとてもおもしろいです！" },
    { text: "宿題はもう終わりました。", hira: "しゅくだいはもうおわりました。" },
    { text: "駅まで歩いて行きます。", hira: "えきまであるいていきます。" },
    { text: "昼ご飯はラーメンを食べました。", hira: "ひるごはんはらーめんをたべました。" },
    { text: "仕事が終わったら帰ります。", hira: "しごとがおわったらかえります。" },
    { text: "週末はゆっくり休みます。", hira: "しゅうまつはゆっくりやすみます。" },
    { text: "今日は早く寝ます。", hira: "きょうははやくねます。" },
    { text: "朝ご飯を食べましたか？", hira: "あさごはんをたべましたか？" },
    { text: "「本当に大丈夫？」と聞きました。", hira: "「ほんとうにだいじょうぶ？」とききました。" },
    { text: "日本語を勉強しています。", hira: "にほんごをべんきょうしています。" },
    { text: "友だちと映画を見ました。", hira: "ともだちとえいがをみました。" },
    { text: "公園で散歩をしました。", hira: "こうえんでさんぽをしました。" },
    { text: "「すごい！」と思いました。", hira: "「すごい！」とおもいました。" },
    { text: "水をたくさん飲みましょう。", hira: "みずをたくさんのみましょう。" },
    { text: "明日は早起きします。", hira: "あしたははやおきします。" },
    { text: "この店は安くて美味しいです！", hira: "このみせはやすくておいしいです！" },
    { text: "今日の仕事は忙しいです。", hira: "きょうのしごとはいそがしいです。" },
    { text: "電話で予約をしました。", hira: "でんわでよやくをしました。" },
    { text: "「あとで行きます」と伝えました。", hira: "「あとでいきます」とつたえました。" },
    { text: "今日は少し疲れています。", hira: "きょうはすこしつかれています。" },
    { text: "部屋をきれいに掃除しました。", hira: "へやをきれいにそうじしました。" },
    { text: "英語の勉強もしています。", hira: "えいごのべんきょうもしています。" },
    { text: "新しい靴を買いました！", hira: "あたらしいくつをかいました！" }
  ]
};

const fingerLabelMap = {
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

const keyFingerMap = {
  "1": "left-pinky", "2": "left-ring", "3": "left-middle", "4": "left-index", "5": "left-index",
  "6": "right-index", "7": "right-index", "8": "right-middle", "9": "right-ring", "0": "right-pinky",
  "-": "right-pinky", "^": "right-pinky", "@": "right-pinky", "[": "right-pinky", "]": "right-pinky",
  ";": "right-pinky", "'": "right-pinky", ",": "right-middle", ".": "right-ring", "/": "right-pinky",
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

const keyboardRows = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "^", "backspace"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "@", "[", "]"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"],
  ["shift-left", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift-right"],
  ["space"]
];

const shiftedCharBaseMap = {
  "!": "1",
  "\"": "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "&": "6",
  "(": "8",
  ")": "9",
  "~": "^",
  "{": "[",
  "}": "]",
  ":": ";",
  "<": ",",
  ">": ".",
  "?": "/"
};

const logQueue = [];

function waitMs(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getComprehensiveDurationSeconds() {
  return COMPREHENSIVE_SECONDS;
}

function getScoreRank(score) {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

async function runCountdown(statusEl, startMessage, centerEl = null) {
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

function showFinishOverlay(centerEl, message = "終了", durationMs = 2000) {
  if (!centerEl) {
    return;
  }

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

function closeScoreOverlay() {
  scoreOverlay.hidden = true;
  scoreOverlayBody.innerHTML = "";
}

function showScoreOverlay(title, html) {
  scoreOverlayTitle.textContent = title;
  scoreOverlayBody.innerHTML = html;
  scoreOverlay.hidden = false;
}

function buildScoreOverlayHtml({ totalScore, summary, metrics, note }) {
  const rank = getScoreRank(totalScore);
  const metricHtml = metrics.map((metric) => `
    <div class="score-card">
      <div class="score-card-label">${metric.label}</div>
      <div class="score-card-value">${metric.value}</div>
    </div>
  `).join("");

  return `
    <div class="score-summary">
      <div class="score-total">${totalScore} 点</div>
      <div class="score-rank">ランク ${rank}</div>
      <div class="score-caption">${summary}</div>
    </div>
    <div class="score-grid">${metricHtml}</div>
    <div class="score-note">${note}</div>
  `;
}

function getAccuracyRate(success, miss) {
  const total = success + miss;
  return total > 0 ? success / total : 0;
}

function buildComprehensiveMouseScore() {
  const minutes = compMouseDurationSeconds / 60;
  const accuracyRate = getAccuracyRate(compMouseSuccess, compMouseMiss);
  const apm = Math.round((compMouseSuccess / minutes) * 10) / 10;
  const avgActionMs = compMouseActionTimes.length > 0
    ? Math.round(compMouseActionTimes.reduce((sum, value) => sum + value, 0) / compMouseActionTimes.length)
    : 0;
  const speedScore = Math.min(60, Math.round((apm / 30) * 60));
  const accuracyScore = Math.round(accuracyRate * 40);
  const totalScore = Math.max(0, Math.min(100, speedScore + accuracyScore));

  return {
    totalScore,
    summary: "速度 60 点 + 正確さ 40 点",
    metrics: [
      { label: "成功回数", value: `${compMouseSuccess} 回` },
      { label: "失敗回数", value: `${compMouseMiss} 回` },
      { label: "APM", value: `${apm}` },
      { label: "正確率", value: `${Math.round(accuracyRate * 100)}%` },
      { label: "平均操作時間", value: avgActionMs > 0 ? `${avgActionMs} ms` : "-" }
    ],
    note: "APM は 1 分あたりの成功操作数です。30 APM を満点基準、正確率を 40 点満点として合算しています。"
  };
}

function buildComprehensiveKeyboardScore() {
  const minutes = keyboardDurationSeconds / 60;
  const accuracyRate = getAccuracyRate(keyboardSuccess, keyboardMiss);
  const kpm = Math.round((keyboardCorrectChars / minutes) * 10) / 10;
  const wpm = Math.round((kpm / 5) * 10) / 10;
  const avgInputMs = keyboardTimes.length > 0
    ? Math.round(keyboardTimes.reduce((sum, value) => sum + value, 0) / keyboardTimes.length)
    : 0;
  const speedScore = Math.min(60, Math.round((kpm / 180) * 60));
  const accuracyScore = Math.round(accuracyRate * 40);
  const totalScore = Math.max(0, Math.min(100, speedScore + accuracyScore));

  return {
    totalScore,
    summary: "速度 60 点 + 正確さ 40 点",
    metrics: [
      { label: "正解回数", value: `${keyboardSuccess} 回` },
      { label: "不正解回数", value: `${keyboardMiss} 回` },
      { label: "KPM", value: `${kpm}` },
      { label: "WPM", value: `${wpm}` },
      { label: "正確率", value: `${Math.round(accuracyRate * 100)}%` },
      { label: "平均入力時間", value: avgInputMs > 0 ? `${avgInputMs} ms` : "-" }
    ],
    note: "KPM は 1 分あたりの正解文字数、WPM は 5 文字を 1 語とする一般的な速度指標です。180 KPM を満点基準にしています。"
  };
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeText(text) {
  return text.toLowerCase();
}

// ひらがな1文字（または拗音などの組み合わせ）ごとの入力候補。先頭が表示用の標準表記。
const kanaRomajiTable = {
  "あ": ["a"], "い": ["i", "yi"], "う": ["u", "wu", "whu"], "え": ["e"], "お": ["o"],
  "か": ["ka", "ca"], "き": ["ki"], "く": ["ku", "cu", "qu"], "け": ["ke"], "こ": ["ko", "co"],
  "さ": ["sa"], "し": ["shi", "si", "ci"], "す": ["su"], "せ": ["se", "ce"], "そ": ["so"],
  "た": ["ta"], "ち": ["chi", "ti"], "つ": ["tsu", "tu"], "て": ["te"], "と": ["to"],
  "な": ["na"], "に": ["ni"], "ぬ": ["nu"], "ね": ["ne"], "の": ["no"],
  "は": ["ha"], "ひ": ["hi"], "ふ": ["fu", "hu"], "へ": ["he"], "ほ": ["ho"],
  "ま": ["ma"], "み": ["mi"], "む": ["mu"], "め": ["me"], "も": ["mo"],
  "や": ["ya"], "ゆ": ["yu"], "よ": ["yo"],
  "ら": ["ra"], "り": ["ri"], "る": ["ru"], "れ": ["re"], "ろ": ["ro"],
  "わ": ["wa"], "を": ["wo"],
  "が": ["ga"], "ぎ": ["gi"], "ぐ": ["gu"], "げ": ["ge"], "ご": ["go"],
  "ざ": ["za"], "じ": ["ji", "zi"], "ず": ["zu"], "ぜ": ["ze"], "ぞ": ["zo"],
  "だ": ["da"], "ぢ": ["di"], "づ": ["du"], "で": ["de"], "ど": ["do"],
  "ば": ["ba"], "び": ["bi"], "ぶ": ["bu"], "べ": ["be"], "ぼ": ["bo"],
  "ぱ": ["pa"], "ぴ": ["pi"], "ぷ": ["pu"], "ぺ": ["pe"], "ぽ": ["po"],
  "ぁ": ["xa", "la"], "ぃ": ["xi", "li"], "ぅ": ["xu", "lu"], "ぇ": ["xe", "le"], "ぉ": ["xo", "lo"],
  "ゃ": ["xya", "lya"], "ゅ": ["xyu", "lyu"], "ょ": ["xyo", "lyo"], "ゎ": ["xwa", "lwa"],
  "っ": ["xtu", "ltu", "xtsu", "ltsu"],
  "きゃ": ["kya"], "きゅ": ["kyu"], "きょ": ["kyo"],
  "しゃ": ["sha", "sya"], "しゅ": ["shu", "syu"], "しぇ": ["she", "sye"], "しょ": ["sho", "syo"],
  "ちゃ": ["cha", "tya", "cya"], "ちゅ": ["chu", "tyu", "cyu"], "ちぇ": ["che", "tye", "cye"], "ちょ": ["cho", "tyo", "cyo"],
  "にゃ": ["nya"], "にゅ": ["nyu"], "にょ": ["nyo"],
  "ひゃ": ["hya"], "ひゅ": ["hyu"], "ひょ": ["hyo"],
  "みゃ": ["mya"], "みゅ": ["myu"], "みょ": ["myo"],
  "りゃ": ["rya"], "りゅ": ["ryu"], "りょ": ["ryo"],
  "ぎゃ": ["gya"], "ぎゅ": ["gyu"], "ぎょ": ["gyo"],
  "じゃ": ["ja", "zya", "jya"], "じゅ": ["ju", "zyu", "jyu"], "じぇ": ["je", "zye", "jye"], "じょ": ["jo", "zyo", "jyo"],
  "ぢゃ": ["dya"], "ぢゅ": ["dyu"], "ぢょ": ["dyo"],
  "びゃ": ["bya"], "びゅ": ["byu"], "びょ": ["byo"],
  "ぴゃ": ["pya"], "ぴゅ": ["pyu"], "ぴょ": ["pyo"],
  "ふぁ": ["fa"], "ふぃ": ["fi"], "ふぇ": ["fe"], "ふぉ": ["fo"],
  "てぃ": ["thi"], "でぃ": ["dhi"], "うぃ": ["wi"], "うぇ": ["we"],
  "ー": ["-"], "。": ["."], "、": [","], "！": ["!"], "？": ["?"],
  "「": ["["], "」": ["]"], "（": ["("], "）": [")"], "・": ["/"], "～": ["~"], "　": [" "], " ": [" "]
};

const smallKanaSet = new Set(["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ"]);

function uniqueList(list) {
  return [...new Set(list)];
}

function getKanaOptions(kana) {
  const direct = kanaRomajiTable[kana];
  if (kana.length === 1) {
    return direct ? [...direct] : [normalizeText(kana)];
  }
  // 拗音などは「き」+「ゃ」(ki + xya) のような分割入力も許可する
  const split = [];
  const firstOpts = getKanaOptions(kana[0]);
  const secondOpts = getKanaOptions(kana.slice(1));
  firstOpts.forEach((a) => secondOpts.forEach((b) => split.push(a + b)));
  return uniqueList([...(direct || []), ...split]);
}

// ひらがな文字列を入力単位（トークン）に分割し、各トークンの入力候補を求める
function buildRomajiTokens(hira) {
  const chars = [...hira];
  const units = [];
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    const next = chars[i + 1];
    if (next && smallKanaSet.has(next) && kanaRomajiTable[ch + next]) {
      units.push(ch + next);
      i += 1;
    } else {
      units.push(ch);
    }
  }

  const tokens = new Array(units.length);
  for (let i = units.length - 1; i >= 0; i -= 1) {
    const unit = units[i];
    const nextToken = tokens[i + 1];
    let options;

    if (unit === "ん") {
      // 「ん」は本来 nn。直後が子音（母音・y・n 以外）で始まる場合だけ n 1回で省略できる
      options = ["nn", "xn"];
      const canOmit = nextToken && nextToken.options.every((opt) => /^[bcdfghjklmpqrstvwxz]/.test(opt));
      if (canOmit) {
        options.unshift("n");
      }
    } else if (unit === "っ" && nextToken && nextToken.options.some((opt) => /^[bcdfghjkmpqrstvwxyz]/.test(opt))) {
      // 促音は次の子音を重ねる（例: がっこう → gakkou）。単独入力(xtu/ltu)も許可
      const doubled = nextToken.options
        .filter((opt) => /^[bcdfghjkmpqrstvwxyz]/.test(opt))
        .map((opt) => opt[0]);
      options = uniqueList([...doubled, ...getKanaOptions("っ")]);
    } else {
      options = getKanaOptions(unit);
    }

    tokens[i] = { kana: unit, options };
  }

  // 表示用の標準表記（促音は次の子音を重ねた形、ん は省略可能なら n）
  tokens.forEach((token) => {
    token.display = token.options[0];
  });
  tokens.forEach((token, idx) => {
    if (token.kana === "っ" && tokens[idx + 1]) {
      token.display = tokens[idx + 1].display[0];
    }
  });

  return tokens;
}

function getRomajiDisplay(tokens) {
  return tokens.map((token) => token.display).join("");
}

// 入力途中の文字列を判定する。valid: ここまで正しい / complete: 入力完了 / nextChars: 次に押せるキー候補
function matchRomajiInput(tokens, typed) {
  const nextChars = new Set();
  let valid = false;
  let complete = false;
  const visited = new Set();

  const walk = (ti, pos) => {
    const key = `${ti}:${pos}`;
    if (visited.has(key)) {
      return;
    }
    visited.add(key);

    if (pos === typed.length) {
      valid = true;
      if (ti === tokens.length) {
        complete = true;
        return;
      }
      tokens[ti].options.forEach((opt) => nextChars.add(opt[0]));
      return;
    }
    if (ti === tokens.length) {
      return;
    }

    const rest = typed.slice(pos);
    tokens[ti].options.forEach((opt) => {
      if (rest.startsWith(opt)) {
        walk(ti + 1, pos + opt.length);
      } else if (opt.startsWith(rest)) {
        valid = true;
        nextChars.add(opt[rest.length]);
      }
    });
  };

  walk(0, 0);
  return { valid, complete, nextChars: [...nextChars] };
}

function isSamePrompt(a, b) {
  if (!a || !b) {
    return false;
  }
  return a.text === b.text && a.hira === b.hira;
}

function pickKeyboardPrompt(level, excludePrompt = null) {
  const samples = keyboardSamplesByLevel[level];
  if (!samples || samples.length === 0) {
    return null;
  }

  if (samples.length === 1 || !excludePrompt) {
    return samples[randomBetween(0, samples.length - 1)];
  }

  let picked = samples[randomBetween(0, samples.length - 1)];
  let attempts = 0;
  while (isSamePrompt(picked, excludePrompt) && attempts < 12) {
    picked = samples[randomBetween(0, samples.length - 1)];
    attempts += 1;
  }

  if (isSamePrompt(picked, excludePrompt)) {
    const candidates = samples.filter((item) => !isSamePrompt(item, excludePrompt));
    if (candidates.length > 0) {
      picked = candidates[randomBetween(0, candidates.length - 1)];
    }
  }

  return picked;
}

function renderKeyboardGuide() {
  const rows = keyboardRows.map((row) => {
    const keys = row.map((key) => {
      const labels = {
        space: "Space",
        enter: "Enter",
        "shift-left": "Shift",
        "shift-right": "Shift",
        backspace: "Back"
      };
      const label = labels[key] || key.toUpperCase();
      const extraClass = key === "space" ? " space" : (key === "enter" || key.startsWith("shift") || key === "backspace") ? " wide" : "";
      // キーは担当する指の色で塗る（指の絵と同じ色）
      return `<div class="kbd-key${extraClass}" data-key="${key}" data-finger="${keyFingerMap[key] || ""}">${label}</div>`;
    }).join("");
    return `<div class="keyboard-row">${keys}</div>`;
  }).join("");

  keyboardVisual.innerHTML = rows;
}

function clearKeyFingerHighlight() {
  document.querySelectorAll(".kbd-key.active").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".finger.active").forEach((el) => el.classList.remove("active"));
}

function getTypingGuideHint(char) {
  if (char === " ") {
    return { keys: ["space"], fingers: ["right-thumb"], label: "Space" };
  }

  if (shiftedCharBaseMap[char]) {
    const base = shiftedCharBaseMap[char];
    // Shift は、文字を打つ手と反対側の手の小指で押す
    const baseFinger = keyFingerMap[base] || "";
    const shiftKey = baseFinger.startsWith("left") ? "shift-right" : "shift-left";
    const fingers = [keyFingerMap[shiftKey], baseFinger].filter(Boolean);
    const shiftLabel = shiftKey === "shift-right" ? "右Shift" : "左Shift";
    return { keys: [base, shiftKey], fingers, label: `${shiftLabel} + ${base.toUpperCase()}` };
  }

  const key = char.toLowerCase();
  if (/^[a-z0-9]$/.test(key) || keyFingerMap[key]) {
    return {
      keys: [key],
      fingers: [keyFingerMap[key]].filter(Boolean),
      label: key === "space" ? "Space" : key.toUpperCase()
    };
  }

  return { keys: [key], fingers: [], label: char };
}

function highlightKeyAndFinger(nextChars) {
  clearKeyFingerHighlight();
  if (nextChars.length === 0) {
    typingGuideText.textContent = "次のキー: Enter";
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

  const fingerLabels = [...fingerSet].map((id) => fingerLabelMap[id]);
  if (keyLabels.length === 1) {
    typingGuideText.textContent = `次のキー: ${keyLabels[0]} / ${fingerLabels.join(" + ") || "-"}`;
    return;
  }

  typingGuideText.textContent = `次キー候補: ${keyLabels.join(" , ")} / ${fingerLabels.join(" , ")}`;
}

function setKeyboardLevel(level) {
  selectedKeyboardLevel = level;
  keyboardLevelButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.level === level);
  });
  typingResult.textContent = "";
  currentPrompt = pickKeyboardPrompt(selectedKeyboardLevel);
  typingPromptText.textContent = promptDisplayText(currentPrompt);
  typingPromptHira.textContent = currentPrompt.hira;
  currentPromptTokens = buildRomajiTokens(currentPrompt.hira);
  currentPromptRoma = getRomajiDisplay(currentPromptTokens);
  typingPromptRoma.textContent = currentPromptRoma;
  typingInput.value = "";
  lastValidTypingInput = "";
  typingInput.classList.remove("is-error");
  updateTypingGuide();
}

function nextKeyboardPrompt() {
  currentPrompt = pickKeyboardPrompt(selectedKeyboardLevel, currentPrompt);
  typingPromptText.textContent = promptDisplayText(currentPrompt);
  typingPromptHira.textContent = currentPrompt.hira;
  currentPromptTokens = buildRomajiTokens(currentPrompt.hira);
  currentPromptRoma = getRomajiDisplay(currentPromptTokens);
  typingPromptRoma.textContent = currentPromptRoma;
  typingInput.value = "";
  lastValidTypingInput = "";
  typingInput.classList.remove("is-error");
  keyboardRoundStartedAt = performance.now();
  updateTypingGuide();
  setTimeout(() => typingInput.focus(), 20);
}

function updateTypingGuide() {
  if (!currentPrompt) {
    return;
  }
  const typed = normalizeText(typingInput.value);
  const result = matchRomajiInput(currentPromptTokens, typed);

  if (!result.valid) {
    typingInput.classList.add("is-error");
    typingGuideText.textContent = "入力がずれています。直前の1文字を確認しましょう。";
    clearKeyFingerHighlight();
    return;
  }

  typingInput.classList.remove("is-error");
  if (result.complete) {
    clearKeyFingerHighlight();
    typingGuideText.textContent = "入力できました。次の問題へ進みます。";
    return;
  }

  highlightKeyAndFinger(result.nextChars);
}

function placeDoubleIconRandom() {
  const rect = doubleArena.getBoundingClientRect();
  const size = doubleIcon.offsetWidth || 96;
  const pad = 10;
  const maxX = Math.max(pad, Math.floor(rect.width - size - pad));
  const maxY = Math.max(pad, Math.floor(rect.height - size - pad));
  const x = randomBetween(pad, maxX);
  const y = randomBetween(pad, maxY);
  doubleIcon.style.left = `${x}px`;
  doubleIcon.style.top = `${y}px`;
}

function placeDragTargetsRandom() {
  const rect = dragArena.getBoundingClientRect();
  const sourceW = dragSourceWrap.offsetWidth || 90;
  const sourceH = dragSourceWrap.offsetHeight || 90;
  const dropW = dropZone.offsetWidth || 170;
  const dropH = dropZone.offsetHeight || 120;
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

  dragSourceWrap.style.left = `${sx}px`;
  dragSourceWrap.style.top = `${sy}px`;
  dropZone.style.left = `${dx}px`;
  dropZone.style.top = `${dy}px`;
}

function placeComprehensiveDragTargetsRandom() {
  const rect = compMouseArena.getBoundingClientRect();
  const sourceW = compMouseDragSourceWrap.offsetWidth || 90;
  const sourceH = compMouseDragSourceWrap.offsetHeight || 90;
  const dropW = compMouseDropZone.offsetWidth || 170;
  const dropH = compMouseDropZone.offsetHeight || 120;
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

  compMouseDragSourceWrap.style.left = `${sx}px`;
  compMouseDragSourceWrap.style.top = `${sy}px`;
  compMouseDropZone.style.left = `${dx}px`;
  compMouseDropZone.style.top = `${dy}px`;
}

function placeComprehensiveClickTargetRandom() {
  const rect = compMouseArena.getBoundingClientRect();
  const size = 72;
  const maxX = Math.max(10, rect.width - size - 10);
  const maxY = Math.max(10, rect.height - size - 10);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  compMouseTarget.style.width = `${size}px`;
  compMouseTarget.style.height = `${size}px`;
  compMouseTarget.style.left = `${x}px`;
  compMouseTarget.style.top = `${y}px`;
}

function placeComprehensiveDoubleIconRandom() {
  const rect = compMouseArena.getBoundingClientRect();
  const size = compMouseDoubleIcon.offsetWidth || 96;
  const pad = 10;
  const maxX = Math.max(pad, Math.floor(rect.width - size - pad));
  const maxY = Math.max(pad, Math.floor(rect.height - size - pad));
  const x = randomBetween(pad, maxX);
  const y = randomBetween(pad, maxY);
  compMouseDoubleIcon.style.left = `${x}px`;
  compMouseDoubleIcon.style.top = `${y}px`;
}

function hideComprehensiveMouseItems() {
  compMouseTarget.style.display = "none";
  compMouseDoubleIcon.style.display = "none";
  compMouseDragSourceWrap.style.display = "none";
  compMouseDropZone.style.display = "none";
}

let currentMouseMode = "click";

function setMode(mode) {
  modeClickBtn.classList.toggle("active", mode === "click");
  modeDoubleBtn.classList.toggle("active", mode === "double");
  modeDragBtn.classList.toggle("active", mode === "drag");

  paneClick.classList.toggle("active", mode === "click");
  paneDouble.classList.toggle("active", mode === "double");
  paneDrag.classList.toggle("active", mode === "drag");
  paneComprehensiveMouse.classList.toggle("active", mode === "comp-mouse");
  paneKeyboard.classList.toggle("active", mode === "keyboard");

  if (["click", "double", "drag"].includes(mode)) {
    currentMouseMode = mode;
  }
}

function setComprehensiveMode(mode) {
  currentComprehensiveMode = mode;
  compMouseBtn.classList.toggle("active", mode === "comp-mouse");
  compKeyboardBtn.classList.toggle("active", mode === "comp-keyboard");

  if (mode === "comp-mouse") {
    keyboardSessionMode = "standard";
    setMode("comp-mouse");
    keyboardStartBtn.textContent = "入力練習開始";
  } else {
    keyboardSessionMode = "comprehensive";
    setKeyboardLevel("sentence");
    setMode("keyboard");
    keyboardStartBtn.textContent = "総合キーボード演習開始";
    keyboardStatus.textContent = "総合キーボード演習: 日本語文章を一定時間入力します";
  }
}

function setCategory(cat) {
  currentCategory = cat;
  catMouseBtn.classList.toggle("active", cat === "mouse");
  catKeyboardBtn.classList.toggle("active", cat === "keyboard");
  catComprehensiveBtn.classList.toggle("active", cat === "comprehensive");
  mouseSubMenu.style.display = cat === "mouse" ? "" : "none";
  keyboardSubMenu.style.display = cat === "keyboard" ? "" : "none";
  comprehensiveSubMenu.style.display = cat === "comprehensive" ? "" : "none";
  if (cat === "mouse") {
    keyboardSessionMode = "standard";
    setMode(currentMouseMode);
    keyboardStartBtn.textContent = "入力練習開始";
  } else if (cat === "keyboard") {
    keyboardSessionMode = "standard";
    setMode("keyboard");
    keyboardStartBtn.textContent = "入力練習開始";
  } else {
    setComprehensiveMode(currentComprehensiveMode);
  }
}

function stopKeyboardTimer() {
  if (keyboardTimer) {
    clearInterval(keyboardTimer);
    keyboardTimer = null;
  }
}

function startKeyboardTimer() {
  stopKeyboardTimer();
  keyboardEndsAt = Date.now() + keyboardDurationSeconds * 1000;
  updateKeyboardMetrics();

  keyboardTimer = setInterval(() => {
    if (!keyboardStarted || keyboardSessionMode !== "comprehensive") {
      stopKeyboardTimer();
      return;
    }

    const remain = Math.max(0, Math.ceil((keyboardEndsAt - Date.now()) / 1000));
    typingAvgMetric.textContent = `残り時間: ${remain}秒`;
    if (remain <= 0) {
      finishComprehensiveKeyboard();
    }
  }, 250);
}

function finishComprehensiveKeyboard() {
  if (!keyboardStarted) {
    return;
  }

  keyboardStarted = false;
  lockAudienceToggle(false);
  stopKeyboardTimer();
  const avg = keyboardTimes.length ? Math.round(keyboardTimes.reduce((a, b) => a + b, 0) / keyboardTimes.length) : 0;
  keyboardStatus.textContent = "2分の総合キーボード演習が終了しました。";
  typingResult.textContent = `終了しました。正解 ${keyboardSuccess} 回 / 不正解 ${keyboardMiss} 回 / 平均 ${avg} ms`;
  typingResult.className = "result score-good";
  keyboardStartBtn.disabled = false;
  keyboardStartBtn.textContent = currentCategory === "comprehensive" ? "総合キーボード演習開始" : "もう一度プレイ";
  keyboardLevelButtons.forEach((btn) => {
    btn.disabled = false;
  });
  clearKeyFingerHighlight();
  typingGuideText.textContent = "総合演習が終了しました。";
  queueEvent("submit", "comprehensive_keyboard_done", {
    level: "sentence",
    success: keyboardSuccess,
    miss: keyboardMiss,
    average_ms: avg,
    correct_chars: keyboardCorrectChars,
    duration_seconds: keyboardDurationSeconds
  }, "success");
  sendLogs();
  showFinishOverlay(typingArea, "終了", 2000);
  const scoreData = buildComprehensiveKeyboardScore();
  setTimeout(() => {
    showScoreOverlay("総合キーボード演習のスコア", buildScoreOverlayHtml(scoreData));
  }, 2000);
}

function updateComprehensiveMouseMetrics() {
  const remain = compMouseEndsAt ? Math.max(0, Math.ceil((compMouseEndsAt - Date.now()) / 1000)) : compMouseDurationSeconds;
  compMouseTimeMetric.textContent = `残り時間: ${remain}秒`;
  compMouseRoundMetric.textContent = `成功: ${compMouseSuccess}`;
  compMouseMissMetric.textContent = `失敗: ${compMouseMiss}`;
}

function stopComprehensiveMouseTimer() {
  if (compMouseTimer) {
    clearInterval(compMouseTimer);
    compMouseTimer = null;
  }
}

function finishComprehensiveMouse() {
  if (!compMouseStarted) {
    return;
  }

  compMouseStarted = false;
  stopComprehensiveMouseTimer();
  hideComprehensiveMouseItems();
  compMousePhaseText.textContent = "モード: 終了";
  compMouseStatus.textContent = "2分の総合マウス演習が終了しました。";
  compMouseResult.textContent = `終了しました。成功 ${compMouseSuccess} 回 / 失敗 ${compMouseMiss} 回`;
  compMouseResult.className = "result score-good";
  compMouseStartBtn.disabled = false;
  compMouseStartBtn.textContent = "総合マウス演習開始";
  queueEvent("submit", "comprehensive_mouse_done", {
    success: compMouseSuccess,
    miss: compMouseMiss,
    average_action_ms: compMouseActionTimes.length > 0
      ? Math.round(compMouseActionTimes.reduce((sum, value) => sum + value, 0) / compMouseActionTimes.length)
      : 0,
    duration_seconds: compMouseDurationSeconds
  }, "success");
  sendLogs();
  showFinishOverlay(compMouseArena, "終了", 2000);
  const scoreData = buildComprehensiveMouseScore();
  setTimeout(() => {
    showScoreOverlay("総合マウス演習のスコア", buildScoreOverlayHtml(scoreData));
  }, 2000);
}

function nextComprehensiveMouseTask() {
  if (!compMouseStarted) {
    return;
  }

  hideComprehensiveMouseItems();
  const modes = ["click", "double", "drag"];
  let nextMode = modes[randomBetween(0, modes.length - 1)];
  if (modes.length > 1) {
    while (nextMode === compMouseMode) {
      nextMode = modes[randomBetween(0, modes.length - 1)];
    }
  }

  compMouseMode = nextMode;
  compMouseRoundStartedAt = performance.now();
  compMouseResult.textContent = "";
  compMouseResult.className = "result";

  if (nextMode === "click") {
    compMousePhaseText.textContent = "モード: クリック";
    compMouseStatus.textContent = "もちをクリックしてください。";
    placeComprehensiveClickTargetRandom();
    compMouseTarget.style.display = "block";
  } else if (nextMode === "double") {
    compMousePhaseText.textContent = "モード: ダブルクリック";
    compMouseStatus.textContent = "ねむっているねこをダブルクリックして起こしてください。";
    compMouseLastDoubleDownAt = null;
    placeComprehensiveDoubleIconRandom();
    compMouseDoubleIcon.style.display = "grid";
  } else {
    compMousePhaseText.textContent = "モード: ドラッグ&ドロップ";
    compMouseStatus.textContent = "ひよこをおうち（巣）までドラッグしてください。";
    compMouseDragDropped = false;
    compMouseDragSourceWrap.style.display = "block";
    compMouseDropZone.style.display = "grid";
    placeComprehensiveDragTargetsRandom();
  }

  updateComprehensiveMouseMetrics();
}

function stopTimer() {
  if (timeTicker) {
    clearInterval(timeTicker);
    timeTicker = null;
  }
}

function startTimer() {
  stopTimer();
  playStartedAt = Date.now();
  timeMetric.textContent = `残り時間: ${MAX_PLAY_SECONDS}秒`;

  timeTicker = setInterval(() => {
    if (!started) {
      stopTimer();
      return;
    }
    const elapsed = Math.floor((Date.now() - playStartedAt) / 1000);
    const remain = Math.max(0, MAX_PLAY_SECONDS - elapsed);
    timeMetric.textContent = `残り時間: ${remain}秒`;

    if (remain <= 0) {
      statusText.textContent = "制限時間になりました。";
      finishClickTest("timeout");
    }
  }, 250);
}

function getRoundConfig(roundNo) {
  if (roundNo <= 4) {
    return { phase: "フェーズ1: まずは基本", size: 88, move: false, scoreBase: 520 };
  }
  if (roundNo <= 8) {
    return { phase: "フェーズ2: 少し速く", size: 66, move: false, scoreBase: 760 };
  }
  return { phase: "フェーズ3: 動くもち", size: 54, move: true, scoreBase: 980 };
}

function stopTargetMove() {
  if (moveTimer) {
    cancelAnimationFrame(moveTimer);
    moveTimer = null;
  }
}

function startTargetMove() {
  stopTargetMove();
  const directionCandidates = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ];
  const [dirX, dirY] = directionCandidates[randomBetween(0, directionCandidates.length - 1)];
  let vx = 1.4 * dirX;
  let vy = 1.1 * dirY;

  const rect = arena.getBoundingClientRect();
  const size = target.offsetWidth;
  const edgeMargin = 46;
  let sx = parseFloat(target.style.left || "0");
  let sy = parseFloat(target.style.top || "0");
  if (vx < 0 && sx < edgeMargin) {
    sx = edgeMargin;
  }
  if (vx > 0 && sx > rect.width - size - edgeMargin) {
    sx = Math.max(0, rect.width - size - edgeMargin);
  }
  if (vy < 0 && sy < edgeMargin) {
    sy = edgeMargin;
  }
  if (vy > 0 && sy > rect.height - size - edgeMargin) {
    sy = Math.max(0, rect.height - size - edgeMargin);
  }
  target.style.left = `${sx}px`;
  target.style.top = `${sy}px`;

  const animate = () => {
    if (!started || target.style.display === "none") {
      return;
    }

    const rect = arena.getBoundingClientRect();
    const size = target.offsetWidth;
    let x = parseFloat(target.style.left || "0");
    let y = parseFloat(target.style.top || "0");

    x += vx;
    y += vy;

    if (x <= 0 || x >= rect.width - size) {
      vx *= -1;
      x = Math.max(0, Math.min(x, rect.width - size));
    }
    if (y <= 0 || y >= rect.height - size) {
      vy *= -1;
      y = Math.max(0, Math.min(y, rect.height - size));
    }

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    moveTimer = requestAnimationFrame(animate);
  };

  moveTimer = requestAnimationFrame(animate);
}

function nowIso() {
  return new Date().toISOString();
}

// 公開版はサーバーなし: 操作記録はどこにも送らない（端末の外へ何も出さない）。
function sendLogs() {}

function queueEvent() {}

function updateClickMetrics() {
  roundMetric.textContent = `ラウンド: ${round} / ${TOTAL_ROUNDS}`;
  missMetric.textContent = `ミスクリック: ${missClicks}`;
  scoreMetric.textContent = `スコア: ${score}`;
  comboMetric.textContent = `コンボ: ${combo}`;
  progressBar.style.width = `${Math.min(100, (round / TOTAL_ROUNDS) * 100)}%`;

  if (reactionTimes.length > 0) {
    const avg = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
    const best = Math.min(...reactionTimes);
    avgMetric.textContent = `平均反応時間: ${avg} ms`;
    bestMetric.textContent = `最短反応時間: ${best} ms`;
  } else {
    avgMetric.textContent = "平均反応時間: -";
    bestMetric.textContent = "最短反応時間: -";
  }
}

function updateKeyboardMetrics() {
  const label = keyboardLevelLabels[selectedKeyboardLevel] || "キーボード";
  if (keyboardSessionMode === "comprehensive") {
    typingRoundMetric.textContent = `正解: ${keyboardSuccess}`;
  } else {
    typingRoundMetric.textContent = `正解: ${keyboardSuccess} / ${getKeyboardTotal(selectedKeyboardLevel)}`;
  }
  typingMissMetric.textContent = `不正解: ${keyboardMiss}`;
  if (keyboardSessionMode === "comprehensive") {
    const remain = keyboardEndsAt ? Math.max(0, Math.ceil((keyboardEndsAt - Date.now()) / 1000)) : COMPREHENSIVE_SECONDS;
    typingAvgMetric.textContent = `残り時間: ${remain}秒`;
  } else if (keyboardTimes.length > 0) {
    const avg = Math.round(keyboardTimes.reduce((a, b) => a + b, 0) / keyboardTimes.length);
    typingAvgMetric.textContent = `${label} 平均入力時間: ${avg} ms`;
  } else {
    typingAvgMetric.textContent = `${label} 平均入力時間: -`;
  }
}

function placeTarget(config) {
  const rect = arena.getBoundingClientRect();
  const size = config.size;
  const maxX = Math.max(10, rect.width - size - 10);
  const maxY = Math.max(10, rect.height - size - 10);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  target.style.width = `${size}px`;
  target.style.height = `${size}px`;
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.style.display = "block";
  targetShownAt = performance.now();
  phaseText.textContent = config.phase;

  statusText.textContent = `ラウンド ${round}: もちをクリック`;
  queueEvent("page_view", "click_target_round", { round, size, x, y, phase: config.phase, moving: config.move });
  sendLogs();

  if (config.move) {
    startTargetMove();
  } else {
    stopTargetMove();
  }
}

function finishClickTest(reason = "completed") {
  started = false;
  target.style.display = "none";
  stopTargetMove();
  stopTimer();

  const avg = reactionTimes.length ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;
  const totalActions = reactionTimes.length + missClicks;
  const hitRate = totalActions > 0 ? Math.round((reactionTimes.length / totalActions) * 100) : 0;
  const summary = `完了: スコア ${score} / 命中率 ${hitRate}% / 平均 ${avg} ms`;
  statusText.textContent = summary;
  if (score >= 8000) {
    resultText.textContent = "すばらしい! かなり正確です。もう一度挑戦するとさらに上達します。";
    resultText.className = "result score-good";
  } else if (score >= 5000) {
    resultText.textContent = "よくできました! 少しずつ速さが上がっています。";
    resultText.className = "result score-good";
  } else {
    resultText.textContent = "お疲れさまでした。ゆっくり確実にクリックするともっと伸びます。";
    resultText.className = "result score-warning";
  }

  queueEvent("submit", "basic_ops_click_done", {
    rounds: TOTAL_ROUNDS,
    end_reason: reason,
    final_score: score,
    average_reaction_ms: avg,
    miss_clicks: missClicks,
    hit_rate: hitRate
  }, "success");

  sendLogs();
  startBtn.disabled = false;
  startBtn.textContent = "もう一度プレイ";
  showFinishOverlay(arena, "終了", 2000);
}

function nextRound() {
  if (!started) {
    return;
  }
  round += 1;
  if (round > TOTAL_ROUNDS) {
    finishClickTest();
    return;
  }

  currentConfig = getRoundConfig(round);
  setTimeout(() => placeTarget(currentConfig), 400 + Math.random() * 500);
  updateClickMetrics();
}

async function startSession(exerciseId) {
  currentExerciseId = exerciseId;
  sessionText.textContent = "準備完了。演習を開始します。";
  return true;
}

startBtn.addEventListener("click", async () => {
  resultText.textContent = "";
  resultText.className = "result";
  startBtn.disabled = true;

  const ok = await startSession("basic_ops_click_01");
  if (!ok) {
    startBtn.disabled = false;
    return;
  }

  round = 0;
  missClicks = 0;
  reactionTimes = [];
  score = 0;
  combo = 0;
  currentConfig = null;
  phaseText.textContent = "フェーズ: 準備中";
  await runCountdown(statusText, "開始します!", arena);
  started = true;
  updateClickMetrics();
  startTimer();
  nextRound();
});

compMouseStartBtn.addEventListener("click", async () => {
  compMouseResult.textContent = "";
  compMouseResult.className = "result";
  compMouseStartBtn.disabled = true;
  closeScoreOverlay();

  const ok = await startSession("basic_ops_comprehensive_mouse_01");
  if (!ok) {
    compMouseStartBtn.disabled = false;
    return;
  }

  compMouseStarted = true;
  compMouseSuccess = 0;
  compMouseMiss = 0;
  compMouseActionTimes = [];
  compMouseMode = null;
  compMouseDurationSeconds = getComprehensiveDurationSeconds();
  compMouseEndsAt = Date.now() + compMouseDurationSeconds * 1000;
  compMousePhaseText.textContent = "モード: 準備中";
  await runCountdown(compMouseStatus, `開始します! (${compMouseDurationSeconds}秒)`, compMouseArena);
  sessionText.textContent = "総合マウス演習を開始しました。";
  compMouseStartBtn.textContent = "実行中...";
  updateComprehensiveMouseMetrics();
  stopComprehensiveMouseTimer();
  compMouseTimer = setInterval(() => {
    if (!compMouseStarted) {
      stopComprehensiveMouseTimer();
      return;
    }
    updateComprehensiveMouseMetrics();
    if (Date.now() >= compMouseEndsAt) {
      finishComprehensiveMouse();
    }
  }, 250);
  nextComprehensiveMouseTask();
});

compMouseTarget.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!compMouseStarted || compMouseMode !== "click") {
    return;
  }

  compMouseSuccess += 1;
  if (compMouseRoundStartedAt) {
    compMouseActionTimes.push(Math.round(performance.now() - compMouseRoundStartedAt));
  }
  compMouseResult.textContent = "成功しました。次の操作へ進みます。";
  compMouseResult.className = "result score-good";
  updateComprehensiveMouseMetrics();
  nextComprehensiveMouseTask();
});

compMouseArena.addEventListener("click", (e) => {
  if (!compMouseStarted) {
    return;
  }
  if (compMouseMode === "click" && e.target !== compMouseTarget) {
    compMouseMiss += 1;
    compMouseResult.textContent = "クリック位置が違います。";
    compMouseResult.className = "result score-warning";
    updateComprehensiveMouseMetrics();
  }
});

compMouseDoubleIcon.addEventListener("mousedown", () => {
  if (!compMouseStarted || compMouseMode !== "double") {
    return;
  }
  const now = performance.now();
  if (compMouseLastDoubleDownAt !== null) {
    const diff = Math.round(now - compMouseLastDoubleDownAt);
    if (diff > 500) {
      compMouseMiss += 1;
      compMouseResult.textContent = "ダブルクリックが遅すぎます。";
      compMouseResult.className = "result score-warning";
      updateComprehensiveMouseMetrics();
    }
  }
  compMouseLastDoubleDownAt = now;
});

compMouseDoubleIcon.addEventListener("dblclick", () => {
  if (!compMouseStarted || compMouseMode !== "double") {
    return;
  }
  compMouseSuccess += 1;
  if (compMouseRoundStartedAt) {
    compMouseActionTimes.push(Math.round(performance.now() - compMouseRoundStartedAt));
  }
  compMouseLastDoubleDownAt = null;
  compMouseResult.textContent = "成功しました。次の操作へ進みます。";
  compMouseResult.className = "result score-good";
  updateComprehensiveMouseMetrics();
  nextComprehensiveMouseTask();
});

compMouseDragItem.addEventListener("dragstart", () => {
  if (!compMouseStarted || compMouseMode !== "drag") {
    return;
  }
  compMouseDragDropped = false;
  compMouseRoundStartedAt = performance.now();
});

compMouseDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

compMouseDropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  if (!compMouseStarted || compMouseMode !== "drag") {
    return;
  }
  compMouseDragDropped = true;
  compMouseSuccess += 1;
  if (compMouseRoundStartedAt) {
    compMouseActionTimes.push(Math.round(performance.now() - compMouseRoundStartedAt));
  }
  compMouseResult.textContent = "成功しました。次の操作へ進みます。";
  compMouseResult.className = "result score-good";
  updateComprehensiveMouseMetrics();
  nextComprehensiveMouseTask();
});

compMouseDragItem.addEventListener("dragend", () => {
  if (!compMouseStarted || compMouseMode !== "drag") {
    return;
  }
  if (compMouseDragDropped) {
    return;
  }
  compMouseMiss += 1;
  compMouseResult.textContent = "ドロップ位置が違います。";
  compMouseResult.className = "result score-warning";
  updateComprehensiveMouseMetrics();
  placeComprehensiveDragTargetsRandom();
});

target.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!started || targetShownAt === null) {
    return;
  }

  const reaction = Math.round(performance.now() - targetShownAt);
  reactionTimes.push(reaction);
  combo += 1;

  const base = currentConfig ? currentConfig.scoreBase : 500;
  const speedBonus = Math.max(80, base - reaction);
  const comboMultiplier = Math.min(2, 1 + combo * 0.05);
  const gained = Math.round(speedBonus * comboMultiplier);
  score += gained;

  queueEvent("click", "target_button", {
    round,
    phase: currentConfig ? currentConfig.phase : "unknown",
    reaction_ms: reaction,
    miss_clicks: missClicks,
    combo,
    score_gained: gained,
    total_score: score,
    x: e.clientX,
    y: e.clientY,
    miss_distance: 0
  }, "success");

  updateClickMetrics();
  target.style.display = "none";
  targetShownAt = null;
  stopTargetMove();
  resultText.textContent = `+${gained}点! 反応 ${reaction}ms`;
  resultText.className = "result score-good";
  sendLogs();
  nextRound();
});

arena.addEventListener("click", (e) => {
  if (!started || e.target === target) {
    return;
  }

  missClicks += 1;
  combo = 0;
  score = Math.max(0, score - 120);
  updateClickMetrics();

  let missDistance = null;
  if (target.style.display !== "none") {
    const tRect = target.getBoundingClientRect();
    const centerX = tRect.left + tRect.width / 2;
    const centerY = tRect.top + tRect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    missDistance = Math.round(Math.sqrt(dx * dx + dy * dy));
  }

  queueEvent("error", "arena_miss_click", {
    round,
    phase: currentConfig ? currentConfig.phase : "unknown",
    x: e.clientX,
    y: e.clientY,
    miss_count: missClicks,
    total_score: score,
    combo,
    miss_distance: missDistance,
    error_code: "MISS_CLICK"
  }, "fail");

  resultText.textContent = `ミス! コンボが切れました（ミス ${missClicks} 回）`;
  resultText.className = "result score-warning";
  sendLogs();
});

doubleStartBtn.addEventListener("click", async () => {
  doubleResult.textContent = "";
  doubleStartBtn.disabled = true;

  const ok = await startSession("basic_ops_double_01");
  if (!ok) {
    doubleStartBtn.disabled = false;
    return;
  }

  doubleStarted = true;
  doubleSuccess = 0;
  doubleMiss = 0;
  doubleIntervals = [];
  lastDoubleDownAt = null;
  await runCountdown(doubleStatus, "ねむっているねこを、すばやくダブルクリックして起こしてください。", doubleArena);
  doubleRoundMetric.textContent = `成功: 0 / ${DOUBLE_TOTAL}`;
  doubleMissMetric.textContent = "失敗: 0";
  doubleAvgMetric.textContent = "平均間隔: -";
  sessionText.textContent = "ダブルクリック練習を開始しました。";
  doubleStartBtn.textContent = "実行中...";
  placeDoubleIconRandom();
});

doubleIcon.addEventListener("mousedown", () => {
  if (!doubleStarted) return;
  const now = performance.now();
  if (lastDoubleDownAt !== null) {
    const diff = Math.round(now - lastDoubleDownAt);
    if (diff > 500) {
      doubleMiss += 1;
      doubleMissMetric.textContent = `失敗: ${doubleMiss}`;
      queueEvent("error", "double_click_too_slow", { interval_ms: diff, fail_count: doubleMiss }, "fail");
    }
  }
  lastDoubleDownAt = now;
});

doubleIcon.addEventListener("dblclick", () => {
  if (!doubleStarted) return;

  const now = performance.now();
  if (lastDoubleDownAt !== null) {
    doubleIntervals.push(Math.round(now - lastDoubleDownAt));
  }

  doubleSuccess += 1;
  doubleRoundMetric.textContent = `成功: ${doubleSuccess} / ${DOUBLE_TOTAL}`;
  const avg = doubleIntervals.length
    ? Math.round(doubleIntervals.reduce((a, b) => a + b, 0) / doubleIntervals.length)
    : 0;
  if (avg > 0) {
    doubleAvgMetric.textContent = `平均間隔: ${avg} ms`;
  }

  queueEvent("click", "double_click_icon", { success_count: doubleSuccess, average_interval_ms: avg }, "success");
  lastDoubleDownAt = null;

  if (doubleSuccess >= DOUBLE_TOTAL) {
    doubleStarted = false;
    doubleStatus.textContent = "クリア! ダブルクリックに慣れてきました。";
    doubleResult.textContent = "完了しました。もう一度挑戦できます。";
    doubleStartBtn.disabled = false;
    doubleStartBtn.textContent = "もう一度プレイ";
    queueEvent("submit", "double_click_done", { success: doubleSuccess, miss: doubleMiss, avg_interval_ms: avg }, "success");
    showFinishOverlay(doubleArena, "終了", 2000);
  }
  if (doubleStarted) {
    placeDoubleIconRandom();
  }

  sendLogs();
});

dragStartBtn.addEventListener("click", async () => {
  dragResult.textContent = "";
  dragStartBtn.disabled = true;

  const ok = await startSession("basic_ops_drag_drop_01");
  if (!ok) {
    dragStartBtn.disabled = false;
    return;
  }

  dragStarted = true;
  dragSuccess = 0;
  dragMiss = 0;
  dragTimes = [];
  await runCountdown(dragStatus, "ひよこを押したまま動かして、おうち（巣）の上で離してください。", dragArena);
  dragRoundMetric.textContent = `成功: 0 / ${DRAG_TOTAL}`;
  dragMissMetric.textContent = "失敗: 0";
  dragTimeMetric.textContent = "平均所要時間: -";
  dragRoundStartedAt = performance.now();
  sessionText.textContent = "ドラッグ&ドロップ練習を開始しました。";
  dragStartBtn.textContent = "実行中...";
  placeDragTargetsRandom();
});

dragItem.addEventListener("dragstart", () => {
  if (!dragStarted) return;
  dragDroppedInZone = false;
  dragRoundStartedAt = performance.now();
  queueEvent("page_view", "drag_start", { success_count: dragSuccess });
  sendLogs();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  if (!dragStarted) return;
  dragDroppedInZone = true;

  const elapsed = dragRoundStartedAt ? Math.round(performance.now() - dragRoundStartedAt) : 0;
  dragTimes.push(elapsed);
  dragSuccess += 1;
  const avg = Math.round(dragTimes.reduce((a, b) => a + b, 0) / dragTimes.length);

  dragRoundMetric.textContent = `成功: ${dragSuccess} / ${DRAG_TOTAL}`;
  dragTimeMetric.textContent = `平均所要時間: ${avg} ms`;
  dragStatus.textContent = `成功! (${elapsed} ms)`;

  queueEvent("submit", "drag_drop_success", { success_count: dragSuccess, elapsed_ms: elapsed, average_ms: avg }, "success");

  if (dragSuccess >= DRAG_TOTAL) {
    dragStarted = false;
    dragResult.textContent = "完了しました。とても上手です。";
    dragStartBtn.disabled = false;
    dragStartBtn.textContent = "もう一度プレイ";
    queueEvent("submit", "drag_drop_done", { success: dragSuccess, miss: dragMiss, average_ms: avg }, "success");
    showFinishOverlay(dragArena, "終了", 2000);
  } else {
    dragRoundStartedAt = performance.now();
    placeDragTargetsRandom();
  }
  sendLogs();
});

dragItem.addEventListener("dragend", () => {
  if (!dragStarted) return;
  if (dragDroppedInZone) return;
  dragMiss += 1;
  dragMissMetric.textContent = `失敗: ${dragMiss}`;
  queueEvent("error", "drag_drop_miss", { miss_count: dragMiss }, "fail");
  placeDragTargetsRandom();
  dragRoundStartedAt = performance.now();
  sendLogs();
});

keyboardStartBtn.addEventListener("click", async () => {
  typingResult.textContent = "";
  typingResult.className = "result";
  keyboardStartBtn.disabled = true;
  closeScoreOverlay();

  const exerciseId = keyboardSessionMode === "comprehensive"
    ? "basic_ops_comprehensive_keyboard_01"
    : `basic_ops_keyboard_${selectedKeyboardLevel}`;
  const ok = await startSession(exerciseId);
  if (!ok) {
    keyboardStartBtn.disabled = false;
    return;
  }

  keyboardStarted = true;
  lockAudienceToggle(true);
  keyboardSuccess = 0;
  keyboardMiss = 0;
  keyboardTimes = [];
  keyboardCorrectChars = 0;
  keyboardDurationSeconds = getComprehensiveDurationSeconds();
  keyboardLevelButtons.forEach((btn) => {
    btn.disabled = true;
  });
  if (keyboardSessionMode === "comprehensive") {
    setKeyboardLevel("sentence");
  }
  await runCountdown(keyboardStatus, "表示されたローマ字を入力してください（自動判定）。", typingArea);
  const kbTotal = getKeyboardTotal(selectedKeyboardLevel);
  typingRoundMetric.textContent = keyboardSessionMode === "comprehensive" ? "正解: 0" : `正解: 0 / ${kbTotal}`;
  typingMissMetric.textContent = "不正解: 0";
  typingAvgMetric.textContent = keyboardSessionMode === "comprehensive"
    ? `残り時間: ${keyboardDurationSeconds}秒`
    : `${keyboardLevelLabels[selectedKeyboardLevel]} 平均入力時間: -`;
  sessionText.textContent = "キーボード入力練習を開始しました。";
  keyboardStartBtn.textContent = "実行中...";
  if (keyboardSessionMode === "comprehensive") {
    startKeyboardTimer();
  }
  nextKeyboardPrompt();
});

function completeKeyboardRound(success) {
  if (!keyboardStarted) {
    return;
  }

  const elapsed = keyboardRoundStartedAt ? Math.round(performance.now() - keyboardRoundStartedAt) : 0;
  if (success) {
    keyboardSuccess += 1;
    keyboardTimes.push(elapsed);
    keyboardCorrectChars += currentPromptRoma.length;
    typingResult.textContent = `正解! ${elapsed} ms`;
    typingResult.className = "result score-good";
    queueEvent("input", "keyboard_typing", {
      level: selectedKeyboardLevel,
      prompt_text: currentPrompt.text,
      prompt_hira: currentPrompt.hira,
      prompt_roma: currentPromptRoma,
      elapsed_ms: elapsed,
      success_count: keyboardSuccess,
      miss_count: keyboardMiss
    }, "success");
  } else {
    keyboardMiss += 1;
    typingResult.textContent = "不正解です。もう一度同じお題を入力しましょう。";
    typingResult.className = "result score-warning";
    queueEvent("error", "keyboard_typing_miss", {
      level: selectedKeyboardLevel,
      prompt_text: currentPrompt.text,
      prompt_hira: currentPrompt.hira,
      prompt_roma: currentPromptRoma,
      elapsed_ms: elapsed,
      success_count: keyboardSuccess,
      miss_count: keyboardMiss
    }, "fail");
  }

  updateKeyboardMetrics();

  if (keyboardSessionMode === "comprehensive") {
    if (success) {
      nextKeyboardPrompt();
    }
    sendLogs();
    return;
  }

  const kbTotal = getKeyboardTotal(selectedKeyboardLevel);
  if (keyboardSuccess >= kbTotal) {
    keyboardStarted = false;
    lockAudienceToggle(false);
    const avg = keyboardTimes.length ? Math.round(keyboardTimes.reduce((a, b) => a + b, 0) / keyboardTimes.length) : 0;
    keyboardStatus.textContent = "クリア! 入力精度が上がっています。";
    typingResult.textContent = `完了しました。平均入力時間 ${avg} ms`;
    typingResult.className = "result score-good";
    keyboardStartBtn.disabled = false;
    keyboardStartBtn.textContent = "もう一度プレイ";
    keyboardLevelButtons.forEach((btn) => {
      btn.disabled = false;
    });
    clearKeyFingerHighlight();
    typingGuideText.textContent = "別のレベルを選んで再挑戦できます。";
    queueEvent("submit", "keyboard_typing_done", {
      level: selectedKeyboardLevel,
      success: keyboardSuccess,
      miss: keyboardMiss,
      average_ms: avg
    }, "success");
    showFinishOverlay(typingArea, "終了", 2000);
  } else if (success) {
    nextKeyboardPrompt();
  }

  sendLogs();
}

typingInput.addEventListener("keydown", (e) => {
  if (!keyboardStarted) {
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
  }
});

typingInput.addEventListener("input", () => {
  if (!keyboardStarted) {
    return;
  }

  const typed = normalizeText(typingInput.value);
  const result = matchRomajiInput(currentPromptTokens, typed);

  if (!result.valid) {
    keyboardMiss += 1;
    typingResult.textContent = "不正解キーです。ガイドのキーを押しましょう。";
    typingResult.className = "result score-warning";
    queueEvent("error", "keyboard_typing_key_miss", {
      level: selectedKeyboardLevel,
      prompt_text: currentPrompt.text,
      prompt_hira: currentPrompt.hira,
      prompt_roma: currentPromptRoma,
      typed_value: typed,
      miss_count: keyboardMiss
    }, "fail");
    typingInput.value = lastValidTypingInput;
    updateKeyboardMetrics();
    updateTypingGuide();
    sendLogs();
    return;
  }

  lastValidTypingInput = typed;
  updateTypingGuide();

  if (result.complete) {
    completeKeyboardRound(true);
  }
});

catMouseBtn.addEventListener("click", () => setCategory("mouse"));
catKeyboardBtn.addEventListener("click", () => setCategory("keyboard"));
catComprehensiveBtn.addEventListener("click", () => setCategory("comprehensive"));
compMouseBtn.addEventListener("click", () => setComprehensiveMode("comp-mouse"));
compKeyboardBtn.addEventListener("click", () => setComprehensiveMode("comp-keyboard"));
modeClickBtn.addEventListener("click", () => setMode("click"));
modeDoubleBtn.addEventListener("click", () => setMode("double"));
modeDragBtn.addEventListener("click", () => setMode("drag"));

keyboardLevelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (keyboardStarted) {
      return;
    }
    setKeyboardLevel(btn.dataset.level);
  });
});

function lockAudienceToggle(locked) {
  document.querySelectorAll("[data-audience-btn]").forEach((btn) => {
    btn.disabled = locked;
  });
}

function applyAudienceTexts() {
  document.querySelectorAll("[data-kids-text]").forEach((el) => {
    if (el.dataset.adultText === undefined) {
      el.dataset.adultText = el.textContent;
    }
    el.textContent = audience === "kids" ? el.dataset.kidsText : el.dataset.adultText;
  });
}

function applyAudience(next) {
  // 入力練習の途中では切り替えない（問題が途中で変わらないように）
  if (keyboardStarted) {
    return false;
  }
  audience = next === "kids" ? "kids" : "adult";
  try {
    localStorage.setItem(AUDIENCE_KEY, audience);
  } catch (_err) {
    // 保存できなくても、このページを開いている間は有効
  }
  document.body.dataset.audience = audience;
  document.querySelectorAll("[data-audience-btn]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.audienceBtn === audience));
  });
  document.getElementById("levelKanjiBtn").hidden = audience === "kids";
  applyAudienceTexts();
  if (audience === "kids" && selectedKeyboardLevel === "kanji") {
    setKeyboardLevel("hira");
  } else {
    typingPromptText.textContent = promptDisplayText(currentPrompt);
  }
  document.dispatchEvent(new CustomEvent("audiencechange", { detail: { audience } }));
  return true;
}

document.querySelectorAll("[data-audience-btn]").forEach((btn) => {
  btn.addEventListener("click", () => applyAudience(btn.dataset.audienceBtn));
});

renderKeyboardGuide();
hideComprehensiveMouseItems();
setKeyboardLevel("hira");
applyAudience(audience);
scoreOverlayCloseBtn.addEventListener("click", closeScoreOverlay);

