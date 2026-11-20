// クリック練習: 出てくるもちを 12 回クリックする。後半は小さく、最後は動き回る。
import { MAX_PLAY_SECONDS, TOTAL_ROUNDS } from "../data.js";
import { CLICK_MISS_PENALTY, clickPoints, getRoundConfig } from "../scoring.js";
import { markSessionReady, placeSizedTarget, runCountdown, setResult, showFinishOverlay } from "../ui.js";
import { $, average, randomBetween } from "../util.js";

export function initClickExercise() {
  const startBtn = $("startBtn");
  const arena = $("arena");
  const target = $("target");
  const phaseText = $("phaseText");
  const statusText = $("statusText");
  const resultText = $("resultText");

  let started = false;
  let round = 0;
  let missClicks = 0;
  let score = 0;
  let combo = 0;
  let reactionTimes = [];
  let currentConfig = null;
  let targetShownAt = null;
  let moveTimer = null;
  let timeTicker = null;

  function updateMetrics() {
    $("roundMetric").textContent = `ラウンド: ${round} / ${TOTAL_ROUNDS}`;
    $("missMetric").textContent = `ミスクリック: ${missClicks}`;
    $("scoreMetric").textContent = `スコア: ${score}`;
    $("comboMetric").textContent = `コンボ: ${combo}`;
    $("progressBar").style.width = `${Math.min(100, (round / TOTAL_ROUNDS) * 100)}%`;

    if (reactionTimes.length > 0) {
      $("avgMetric").textContent = `平均反応時間: ${average(reactionTimes)} ms`;
      $("bestMetric").textContent = `最短反応時間: ${Math.min(...reactionTimes)} ms`;
    } else {
      $("avgMetric").textContent = "平均反応時間: -";
      $("bestMetric").textContent = "最短反応時間: -";
    }
  }

  // ---- 制限時間

  function stopTimer() {
    if (timeTicker) {
      clearInterval(timeTicker);
      timeTicker = null;
    }
  }

  function startTimer() {
    stopTimer();
    const playStartedAt = Date.now();
    $("timeMetric").textContent = `残り時間: ${MAX_PLAY_SECONDS}秒`;

    timeTicker = setInterval(() => {
      if (!started) {
        stopTimer();
        return;
      }
      const elapsed = Math.floor((Date.now() - playStartedAt) / 1000);
      const remain = Math.max(0, MAX_PLAY_SECONDS - elapsed);
      $("timeMetric").textContent = `残り時間: ${remain}秒`;

      if (remain <= 0) {
        statusText.textContent = "制限時間になりました。";
        finish();
      }
    }, 250);
  }

  // ---- 動くもち（フェーズ3）: 斜めに進み、壁で跳ね返る

  function stopTargetMove() {
    if (moveTimer) {
      cancelAnimationFrame(moveTimer);
      moveTimer = null;
    }
  }

  function startTargetMove() {
    stopTargetMove();
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    const [dirX, dirY] = directions[randomBetween(0, directions.length - 1)];
    let vx = 1.4 * dirX;
    let vy = 1.1 * dirY;

    // 壁ぎわで出たときは、進む向きに少し余裕を作ってから動かす
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

      const box = arena.getBoundingClientRect();
      const width = target.offsetWidth;
      let x = parseFloat(target.style.left || "0") + vx;
      let y = parseFloat(target.style.top || "0") + vy;

      if (x <= 0 || x >= box.width - width) {
        vx *= -1;
        x = Math.max(0, Math.min(x, box.width - width));
      }
      if (y <= 0 || y >= box.height - width) {
        vy *= -1;
        y = Math.max(0, Math.min(y, box.height - width));
      }

      target.style.left = `${x}px`;
      target.style.top = `${y}px`;

      moveTimer = requestAnimationFrame(animate);
    };

    moveTimer = requestAnimationFrame(animate);
  }

  // ---- ラウンドの進行

  function showTarget(config) {
    placeSizedTarget(target, arena, config.size);
    target.style.display = "block";
    targetShownAt = performance.now();
    phaseText.textContent = config.phase;
    statusText.textContent = `ラウンド ${round}: もちをクリック`;

    if (config.move) {
      startTargetMove();
    } else {
      stopTargetMove();
    }
  }

  function nextRound() {
    if (!started) {
      return;
    }
    round += 1;
    if (round > TOTAL_ROUNDS) {
      finish();
      return;
    }

    currentConfig = getRoundConfig(round);
    // 少し間を置いてから出す（出る瞬間を読ませない）
    setTimeout(() => showTarget(currentConfig), 400 + Math.random() * 500);
    updateMetrics();
  }

  function finish() {
    started = false;
    target.style.display = "none";
    stopTargetMove();
    stopTimer();

    const avg = average(reactionTimes);
    const totalActions = reactionTimes.length + missClicks;
    const hitRate = totalActions > 0 ? Math.round((reactionTimes.length / totalActions) * 100) : 0;
    statusText.textContent = `完了: スコア ${score} / 命中率 ${hitRate}% / 平均 ${avg} ms`;
    if (score >= 8000) {
      setResult(resultText, "すばらしい! かなり正確です。もう一度挑戦するとさらに上達します。", "good");
    } else if (score >= 5000) {
      setResult(resultText, "よくできました! 少しずつ速さが上がっています。", "good");
    } else {
      setResult(resultText, "お疲れさまでした。ゆっくり確実にクリックするともっと伸びます。", "warning");
    }

    startBtn.disabled = false;
    startBtn.textContent = "もう一度プレイ";
    showFinishOverlay(arena, "終了", 2000);
  }

  // ---- 操作

  startBtn.addEventListener("click", async () => {
    setResult(resultText, "");
    startBtn.disabled = true;
    markSessionReady();

    round = 0;
    missClicks = 0;
    reactionTimes = [];
    score = 0;
    combo = 0;
    currentConfig = null;
    phaseText.textContent = "フェーズ: 準備中";
    await runCountdown(statusText, "開始します!", arena);
    started = true;
    updateMetrics();
    startTimer();
    nextRound();
  });

  target.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!started || targetShownAt === null) {
      return;
    }

    const reaction = Math.round(performance.now() - targetShownAt);
    reactionTimes.push(reaction);
    combo += 1;
    const gained = clickPoints(currentConfig ? currentConfig.scoreBase : 500, reaction, combo);
    score += gained;

    updateMetrics();
    target.style.display = "none";
    targetShownAt = null;
    stopTargetMove();
    setResult(resultText, `+${gained}点! 反応 ${reaction}ms`, "good");
    nextRound();
  });

  // もち以外の場所をクリックしたらミス（コンボが切れて減点）
  arena.addEventListener("click", (e) => {
    if (!started || e.target === target) {
      return;
    }

    missClicks += 1;
    combo = 0;
    score = Math.max(0, score - CLICK_MISS_PENALTY);
    updateMetrics();
    setResult(resultText, `ミス! コンボが切れました（ミス ${missClicks} 回）`, "warning");
  });
}
