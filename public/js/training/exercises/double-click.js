// ダブルクリック練習: ねむっているねこを、すばやくダブルクリックして起こす。
import { DOUBLE_CLICK_MAX_INTERVAL_MS, DOUBLE_TOTAL } from "../data.js";
import { markSessionReady, placeRandomly, runCountdown, showFinishOverlay } from "../ui.js";
import { $, average } from "../util.js";

export function initDoubleClickExercise() {
  const startBtn = $("doubleStartBtn");
  const arena = $("doubleArena");
  const icon = $("doubleIcon");
  const status = $("doubleStatus");
  const result = $("doubleResult");
  const roundMetric = $("doubleRoundMetric");
  const missMetric = $("doubleMissMetric");
  const avgMetric = $("doubleAvgMetric");

  let started = false;
  let success = 0;
  let miss = 0;
  let intervals = [];
  let lastDownAt = null;

  startBtn.addEventListener("click", async () => {
    result.textContent = "";
    startBtn.disabled = true;
    markSessionReady();

    started = true;
    success = 0;
    miss = 0;
    intervals = [];
    lastDownAt = null;
    await runCountdown(status, "ねむっているねこを、すばやくダブルクリックして起こしてください。", arena);
    roundMetric.textContent = `成功: 0 / ${DOUBLE_TOTAL}`;
    missMetric.textContent = "失敗: 0";
    avgMetric.textContent = "平均間隔: -";
    $("sessionText").textContent = "ダブルクリック練習を開始しました。";
    startBtn.textContent = "実行中...";
    placeRandomly(icon, arena);
  });

  // 2回目の押下まで間が空きすぎたら失敗
  icon.addEventListener("mousedown", () => {
    if (!started) return;
    const now = performance.now();
    if (lastDownAt !== null && Math.round(now - lastDownAt) > DOUBLE_CLICK_MAX_INTERVAL_MS) {
      miss += 1;
      missMetric.textContent = `失敗: ${miss}`;
    }
    lastDownAt = now;
  });

  icon.addEventListener("dblclick", () => {
    if (!started) return;

    const now = performance.now();
    if (lastDownAt !== null) {
      intervals.push(Math.round(now - lastDownAt));
    }

    success += 1;
    roundMetric.textContent = `成功: ${success} / ${DOUBLE_TOTAL}`;
    const avg = average(intervals);
    if (avg > 0) {
      avgMetric.textContent = `平均間隔: ${avg} ms`;
    }
    lastDownAt = null;

    if (success >= DOUBLE_TOTAL) {
      started = false;
      status.textContent = "クリア! ダブルクリックに慣れてきました。";
      result.textContent = "完了しました。もう一度挑戦できます。";
      startBtn.disabled = false;
      startBtn.textContent = "もう一度プレイ";
      showFinishOverlay(arena, "終了", 2000);
    } else {
      placeRandomly(icon, arena);
    }
  });
}
