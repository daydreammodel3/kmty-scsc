// ドラッグ&ドロップ練習: ひよこを押したまま動かして、おうち（巣）の上で離す。
import { DRAG_TOTAL } from "../data.js";
import { markSessionReady, placeDragPair, runCountdown, showFinishOverlay } from "../ui.js";
import { $, average } from "../util.js";

export function initDragExercise() {
  const startBtn = $("dragStartBtn");
  const arena = $("dragArena");
  const item = $("dragItem");
  const source = $("dragSourceWrap");
  const dropZone = $("dropZone");
  const status = $("dragStatus");
  const result = $("dragResult");
  const roundMetric = $("dragRoundMetric");
  const missMetric = $("dragMissMetric");
  const timeMetric = $("dragTimeMetric");

  let started = false;
  let success = 0;
  let miss = 0;
  let times = [];
  let roundStartedAt = null;
  let droppedInZone = false;

  startBtn.addEventListener("click", async () => {
    result.textContent = "";
    startBtn.disabled = true;
    markSessionReady();

    started = true;
    success = 0;
    miss = 0;
    times = [];
    await runCountdown(status, "ひよこを押したまま動かして、おうち（巣）の上で離してください。", arena);
    roundMetric.textContent = `成功: 0 / ${DRAG_TOTAL}`;
    missMetric.textContent = "失敗: 0";
    timeMetric.textContent = "平均所要時間: -";
    roundStartedAt = performance.now();
    $("sessionText").textContent = "ドラッグ&ドロップ練習を開始しました。";
    startBtn.textContent = "実行中...";
    placeDragPair(source, dropZone, arena);
  });

  item.addEventListener("dragstart", () => {
    if (!started) return;
    droppedInZone = false;
    roundStartedAt = performance.now();
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!started) return;
    droppedInZone = true;

    const elapsed = roundStartedAt ? Math.round(performance.now() - roundStartedAt) : 0;
    times.push(elapsed);
    success += 1;

    roundMetric.textContent = `成功: ${success} / ${DRAG_TOTAL}`;
    timeMetric.textContent = `平均所要時間: ${average(times)} ms`;
    status.textContent = `成功! (${elapsed} ms)`;

    if (success >= DRAG_TOTAL) {
      started = false;
      result.textContent = "完了しました。とても上手です。";
      startBtn.disabled = false;
      startBtn.textContent = "もう一度プレイ";
      showFinishOverlay(arena, "終了", 2000);
    } else {
      roundStartedAt = performance.now();
      placeDragPair(source, dropZone, arena);
    }
  });

  // 巣の外で離したら失敗。置き直してやり直す
  item.addEventListener("dragend", () => {
    if (!started || droppedInZone) return;
    miss += 1;
    missMetric.textContent = `失敗: ${miss}`;
    placeDragPair(source, dropZone, arena);
    roundStartedAt = performance.now();
  });
}
