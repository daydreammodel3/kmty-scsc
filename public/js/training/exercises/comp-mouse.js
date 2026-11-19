// 総合演習（マウス）: クリック・ダブルクリック・ドラッグを、ランダムに 2 分間続ける。
import { COMPREHENSIVE_SECONDS, DOUBLE_CLICK_MAX_INTERVAL_MS } from "../data.js";
import { comprehensiveMouseScore } from "../scoring.js";
import {
  closeScoreOverlay, markSessionReady, placeDragPair, placeRandomly, placeSizedTarget,
  runCountdown, setResult, showFinishOverlay, showScoreAfterFinish
} from "../ui.js";
import { $, randomBetween } from "../util.js";

const TASKS = ["click", "double", "drag"];
const CLICK_TARGET_SIZE = 72;

export function initComprehensiveMouseExercise() {
  const startBtn = $("compMouseStartBtn");
  const arena = $("compMouseArena");
  const clickTarget = $("compMouseTarget");
  const doubleIcon = $("compMouseDoubleIcon");
  const dragSource = $("compMouseDragSourceWrap");
  const dragItem = $("compMouseDragItem");
  const dropZone = $("compMouseDropZone");
  const phaseText = $("compMousePhaseText");
  const status = $("compMouseStatus");
  const result = $("compMouseResult");

  const durationSeconds = COMPREHENSIVE_SECONDS;
  let started = false;
  let success = 0;
  let miss = 0;
  let actionTimes = [];
  let task = null;            // いまの操作: click / double / drag
  let timer = null;
  let endsAt = null;
  let roundStartedAt = null;
  let lastDoubleDownAt = null;
  let dragDropped = false;

  function hideItems() {
    clickTarget.style.display = "none";
    doubleIcon.style.display = "none";
    dragSource.style.display = "none";
    dropZone.style.display = "none";
  }

  function updateMetrics() {
    const remain = endsAt ? Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)) : durationSeconds;
    $("compMouseTimeMetric").textContent = `残り時間: ${remain}秒`;
    $("compMouseRoundMetric").textContent = `成功: ${success}`;
    $("compMouseMissMetric").textContent = `失敗: ${miss}`;
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function succeed() {
    success += 1;
    if (roundStartedAt) {
      actionTimes.push(Math.round(performance.now() - roundStartedAt));
    }
    setResult(result, "成功しました。次の操作へ進みます。", "good");
    updateMetrics();
    nextTask();
  }

  function fail(message) {
    miss += 1;
    setResult(result, message, "warning");
    updateMetrics();
  }

  // 前と違う操作を選んで出す
  function nextTask() {
    if (!started) {
      return;
    }

    hideItems();
    let next = TASKS[randomBetween(0, TASKS.length - 1)];
    while (next === task) {
      next = TASKS[randomBetween(0, TASKS.length - 1)];
    }

    task = next;
    roundStartedAt = performance.now();
    setResult(result, "");

    if (next === "click") {
      phaseText.textContent = "モード: クリック";
      status.textContent = "もちをクリックしてください。";
      placeSizedTarget(clickTarget, arena, CLICK_TARGET_SIZE);
      clickTarget.style.display = "block";
    } else if (next === "double") {
      phaseText.textContent = "モード: ダブルクリック";
      status.textContent = "ねむっているねこをダブルクリックして起こしてください。";
      lastDoubleDownAt = null;
      placeRandomly(doubleIcon, arena);
      doubleIcon.style.display = "grid";
    } else {
      phaseText.textContent = "モード: ドラッグ&ドロップ";
      status.textContent = "ひよこをおうち（巣）までドラッグしてください。";
      dragDropped = false;
      dragSource.style.display = "block";
      dropZone.style.display = "grid";
      placeDragPair(dragSource, dropZone, arena);
    }

    updateMetrics();
  }

  function finish() {
    if (!started) {
      return;
    }

    started = false;
    stopTimer();
    hideItems();
    phaseText.textContent = "モード: 終了";
    status.textContent = "2分の総合マウス演習が終了しました。";
    setResult(result, `終了しました。成功 ${success} 回 / 失敗 ${miss} 回`, "good");
    startBtn.disabled = false;
    startBtn.textContent = "総合マウス演習開始";
    showFinishOverlay(arena, "終了", 2000);
    showScoreAfterFinish("総合マウス演習のスコア", comprehensiveMouseScore({ success, miss, actionTimes, durationSeconds }));
  }

  // ---- 操作

  startBtn.addEventListener("click", async () => {
    setResult(result, "");
    startBtn.disabled = true;
    closeScoreOverlay();
    markSessionReady();

    started = true;
    success = 0;
    miss = 0;
    actionTimes = [];
    task = null;
    // 制限時間はカウントダウンを含めて数える
    endsAt = Date.now() + durationSeconds * 1000;
    phaseText.textContent = "モード: 準備中";
    await runCountdown(status, `開始します! (${durationSeconds}秒)`, arena);
    $("sessionText").textContent = "総合マウス演習を開始しました。";
    startBtn.textContent = "実行中...";
    updateMetrics();
    stopTimer();
    timer = setInterval(() => {
      if (!started) {
        stopTimer();
        return;
      }
      updateMetrics();
      if (Date.now() >= endsAt) {
        finish();
      }
    }, 250);
    nextTask();
  });

  clickTarget.addEventListener("click", (e) => {
    e.stopPropagation();
    if (started && task === "click") {
      succeed();
    }
  });

  arena.addEventListener("click", (e) => {
    if (started && task === "click" && e.target !== clickTarget) {
      fail("クリック位置が違います。");
    }
  });

  doubleIcon.addEventListener("mousedown", () => {
    if (!started || task !== "double") {
      return;
    }
    const now = performance.now();
    if (lastDoubleDownAt !== null && Math.round(now - lastDoubleDownAt) > DOUBLE_CLICK_MAX_INTERVAL_MS) {
      fail("ダブルクリックが遅すぎます。");
    }
    lastDoubleDownAt = now;
  });

  doubleIcon.addEventListener("dblclick", () => {
    if (!started || task !== "double") {
      return;
    }
    lastDoubleDownAt = null;
    succeed();
  });

  dragItem.addEventListener("dragstart", () => {
    if (!started || task !== "drag") {
      return;
    }
    dragDropped = false;
    roundStartedAt = performance.now();
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!started || task !== "drag") {
      return;
    }
    dragDropped = true;
    succeed();
  });

  dragItem.addEventListener("dragend", () => {
    if (!started || task !== "drag" || dragDropped) {
      return;
    }
    fail("ドロップ位置が違います。");
    placeDragPair(dragSource, dropZone, arena);
  });

  return { hideItems };
}
