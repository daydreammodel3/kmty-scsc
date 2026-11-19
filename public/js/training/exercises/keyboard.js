// キーボード練習: 表示されたお題を、ローマ字で打つ。1文字ごとに自動で判定する。
//
// 2 つの進め方がある。
// - standard（キーボード入力練習）: 選んだレベルのお題を 12 問
// - comprehensive（総合演習）: 日本語文章を 2 分間、できるだけ多く
import { COMPREHENSIVE_SECONDS, KEYBOARD_TOTAL } from "../data.js";
import { pickPrompt } from "../prompts.js";
import { buildRomajiTokens, getRomajiDisplay, matchRomajiInput, normalizeText } from "../romaji.js";
import { comprehensiveKeyboardScore, keyAccuracyPercent, keyboardPace, kpmLevelIndex } from "../scoring.js";
import { byAudience, formatSecPerKey, kpmLevels, lockAudienceToggle, promptDisplayText } from "../audience.js";
import { clearKeyFingerHighlight, highlightKeyAndFinger } from "../keyboard-guide.js";
import {
  closeScoreOverlay, markSessionReady, runCountdown, setResult, showFinishOverlay, showScoreAfterFinish
} from "../ui.js";
import { $ } from "../util.js";

// getCategory: いま選ばれているカテゴリ（終了後のボタンの文言を決める）
export function initKeyboardExercise({ getCategory }) {
  const startBtn = $("keyboardStartBtn");
  const status = $("keyboardStatus");
  const typingArea = document.querySelector("#paneKeyboard .typing-area");
  const input = $("typingInput");
  const guideText = $("typingGuideText");
  const result = $("typingResult");
  const promptText = $("typingPromptText");
  const promptHira = $("typingPromptHira");
  const promptRoma = $("typingPromptRoma");
  const levelButtons = document.querySelectorAll(".level-btn");
  const roundMetric = $("typingRoundMetric");
  const missMetric = $("typingMissMetric");
  const avgMetric = $("typingAvgMetric");
  const accuracyMetric = $("typingAccuracyMetric");

  let started = false;
  let sessionMode = "standard";
  let level = "hira";
  let prompt = null;
  let tokens = [];
  let roma = "";
  let lastValidInput = "";
  let success = 0;
  let miss = 0;            // 打ち間違えたキーの数
  let correctChars = 0;    // 正解したお題のキーの数の合計
  let roundTimes = [];     // 正解したお題ごとの所要時間
  let roundStartedAt = null;
  let timer = null;
  let endsAt = null;
  const durationSeconds = COMPREHENSIVE_SECONDS;

  const isComprehensive = () => sessionMode === "comprehensive";

  // ---- 成果の表示

  // 総合演習は制限時間全体、通常の練習は正解したお題を打っていた時間で割る
  function currentKpm() {
    if (isComprehensive()) {
      return Math.round(correctChars / (durationSeconds / 60));
    }
    const pace = keyboardPace(roundTimes, correctChars);
    return pace ? pace.perMinute : null;
  }

  // KPM の目安の表。activeIndex の段階を強調する
  function renderKpmScale(activeIndex = -1) {
    const scale = $("kpmScale");
    if (!scale) return;
    scale.innerHTML = kpmLevels().map((kpmLevel, i) => `
    <div class="kpm-level${i === activeIndex ? " is-active" : ""}">
      <div class="kpm-level-name">${kpmLevel.name}</div>
      <div class="kpm-level-desc">${kpmLevel.desc}</div>
    </div>
  `).join("");
  }

  // 練習が終わったら、目安の表で自分の段階を強調する（文章では出さない）
  function showKpmResult() {
    const kpm = currentKpm();
    renderKpmScale(kpm === null ? -1 : kpmLevelIndex(kpmLevels(), kpm));
  }

  const correctLabel = () => byAudience("正解", "せいかい");

  function remainSeconds() {
    return endsAt ? Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)) : durationSeconds;
  }

  function updateMetrics() {
    roundMetric.textContent = isComprehensive()
      ? `${correctLabel()}: ${success}`
      : `${correctLabel()}: ${success} / ${KEYBOARD_TOTAL}`;
    missMetric.textContent = `${byAudience("不正解", "まちがい")}: ${miss}`;
    avgMetric.textContent = isComprehensive()
      ? `残り時間: ${remainSeconds()}秒`
      : `${byAudience("1キーあたり", "1キー")}: ${formatSecPerKey(keyboardPace(roundTimes, correctChars))}`;
    const accuracyLabel = byAudience("正確さ", "ただしさ");
    accuracyMetric.textContent = correctChars + miss > 0
      ? `${accuracyLabel}: ${keyAccuracyPercent(correctChars, miss)}%`
      : `${accuracyLabel}: -`;
  }

  // ---- お題

  function showPrompt(next) {
    prompt = next;
    promptText.textContent = promptDisplayText(prompt);
    promptHira.textContent = prompt.hira;
    tokens = buildRomajiTokens(prompt.hira);
    roma = getRomajiDisplay(tokens);
    promptRoma.textContent = roma;
    input.value = "";
    lastValidInput = "";
    input.classList.remove("is-error");
  }

  function setLevel(next) {
    level = next;
    levelButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.level === next);
    });
    result.textContent = "";
    showPrompt(pickPrompt(level));
    updateGuide();
  }

  function nextPrompt() {
    showPrompt(pickPrompt(level, prompt));
    roundStartedAt = performance.now();
    updateGuide();
    setTimeout(() => input.focus(), 20);
  }

  // 入力欄の中身から、次に押すキーの案内を出す
  function updateGuide() {
    if (!prompt) {
      return;
    }
    const match = matchRomajiInput(tokens, normalizeText(input.value));

    if (!match.valid) {
      input.classList.add("is-error");
      guideText.textContent = "入力がずれています。直前の1文字を確認しましょう。";
      clearKeyFingerHighlight();
      return;
    }

    input.classList.remove("is-error");
    if (match.complete) {
      clearKeyFingerHighlight();
      guideText.textContent = "入力できました。次の問題へ進みます。";
      return;
    }

    highlightKeyAndFinger(match.nextChars, guideText);
  }

  // ---- 練習の始まりと終わり

  function setLevelButtonsDisabled(disabled) {
    levelButtons.forEach((btn) => {
      btn.disabled = disabled;
    });
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    stopTimer();
    endsAt = Date.now() + durationSeconds * 1000;
    updateMetrics();

    timer = setInterval(() => {
      if (!started || !isComprehensive()) {
        stopTimer();
        return;
      }
      const remain = remainSeconds();
      avgMetric.textContent = `残り時間: ${remain}秒`;
      if (remain <= 0) {
        finishComprehensive();
      }
    }, 250);
  }

  // 終わったときの共通の後片付け
  function endSession(statusMessage, buttonLabel, guideMessage) {
    started = false;
    lockAudienceToggle(false);
    status.textContent = statusMessage;
    result.textContent = "";
    showKpmResult();
    result.className = "result score-good";
    startBtn.disabled = false;
    startBtn.textContent = buttonLabel;
    setLevelButtonsDisabled(false);
    clearKeyFingerHighlight();
    guideText.textContent = guideMessage;
  }

  function finishComprehensive() {
    if (!started) {
      return;
    }
    stopTimer();
    endSession(
      "2分の総合キーボード演習が終了しました。",
      getCategory() === "comprehensive" ? "総合キーボード演習開始" : "もう一度プレイ",
      "総合演習が終了しました。"
    );
    showFinishOverlay(typingArea, "終了", 2000);
    showScoreAfterFinish("総合キーボード演習のスコア", comprehensiveKeyboardScore({
      success,
      miss,
      correctChars,
      durationSeconds,
      levels: kpmLevels(),
      paceText: formatSecPerKey(keyboardPace(roundTimes, correctChars))
    }));
  }

  // お題を最後まで正しく打てたとき
  function completeRound() {
    const elapsed = roundStartedAt ? Math.round(performance.now() - roundStartedAt) : 0;
    success += 1;
    roundTimes.push(elapsed);
    correctChars += roma.length;
    setResult(result, `正解! ${(elapsed / 1000).toFixed(1)}秒`, "good");
    updateMetrics();

    if (isComprehensive()) {
      nextPrompt();
      return;
    }

    if (success >= KEYBOARD_TOTAL) {
      endSession("クリア! 入力精度が上がっています。", "もう一度プレイ", "別のレベルを選んで再挑戦できます。");
      showFinishOverlay(typingArea, "終了", 2000);
    } else {
      nextPrompt();
    }
  }

  startBtn.addEventListener("click", async () => {
    setResult(result, "");
    startBtn.disabled = true;
    closeScoreOverlay();
    markSessionReady();

    started = true;
    lockAudienceToggle(true);
    success = 0;
    miss = 0;
    roundTimes = [];
    correctChars = 0;
    setLevelButtonsDisabled(true);
    if (isComprehensive()) {
      setLevel("sentence");
    }
    await runCountdown(status, "表示されたローマ字を入力してください（自動判定）。", typingArea);
    roundMetric.textContent = isComprehensive() ? `${correctLabel()}: 0` : `${correctLabel()}: 0 / ${KEYBOARD_TOTAL}`;
    missMetric.textContent = `${byAudience("不正解", "まちがい")}: 0`;
    avgMetric.textContent = isComprehensive()
      ? `残り時間: ${durationSeconds}秒`
      : `${byAudience("1キーあたり", "1キー")}: -`;
    accuracyMetric.textContent = `${byAudience("正確さ", "ただしさ")}: -`;
    renderKpmScale();
    $("sessionText").textContent = "キーボード入力練習を開始しました。";
    startBtn.textContent = "実行中...";
    if (isComprehensive()) {
      startTimer();
    }
    nextPrompt();
  });

  // 練習中は Enter で送信しない（入力は 1 文字ごとに自動判定）
  input.addEventListener("keydown", (e) => {
    if (started && e.key === "Enter") {
      e.preventDefault();
    }
  });

  input.addEventListener("input", () => {
    if (!started) {
      return;
    }

    const typed = normalizeText(input.value);
    const match = matchRomajiInput(tokens, typed);

    // 間違えたキーは取り消して、正しかったところまで戻す
    if (!match.valid) {
      miss += 1;
      setResult(result, "不正解キーです。ガイドのキーを押しましょう。", "warning");
      input.value = lastValidInput;
      updateMetrics();
      updateGuide();
      return;
    }

    lastValidInput = typed;
    updateGuide();

    if (match.complete) {
      completeRound();
    }
  });

  levelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!started) {
        setLevel(btn.dataset.level);
      }
    });
  });

  return {
    isStarted: () => started,
    getLevel: () => level,
    setLevel,
    renderKpmScale,

    // キーボード入力練習として使う
    useStandardSession() {
      sessionMode = "standard";
      startBtn.textContent = "入力練習開始";
    },

    // 総合演習として使う（日本語文章を一定時間）
    useComprehensiveSession() {
      sessionMode = "comprehensive";
      setLevel("sentence");
      startBtn.textContent = "総合キーボード演習開始";
      status.textContent = "総合キーボード演習: 日本語文章を一定時間入力します";
    },

    // おとな／こどもの切り替えで、お題の表記だけ変える
    refreshPromptText() {
      promptText.textContent = promptDisplayText(prompt);
    }
  };
}
