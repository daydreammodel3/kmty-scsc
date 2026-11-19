// 点数・正確さ・速さの計算。画面には触らない（テストから読み込める）。
import { average } from "./util.js";

export function getScoreRank(score) {
  if (score >= 90) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

export function accuracyRate(success, miss) {
  const total = success + miss;
  return total > 0 ? success / total : 0;
}

// ---- クリック練習

// ラウンドが進むほど、もちが小さく、速く、最後は動くようになる
export function getRoundConfig(roundNo) {
  if (roundNo <= 4) {
    return { phase: "フェーズ1: まずは基本", size: 88, move: false, scoreBase: 520 };
  }
  if (roundNo <= 8) {
    return { phase: "フェーズ2: 少し速く", size: 66, move: false, scoreBase: 760 };
  }
  return { phase: "フェーズ3: 動くもち", size: 54, move: true, scoreBase: 980 };
}

// 1回当てたときの得点。速いほど高く、コンボが続くほど倍率が上がる（最大2倍）
export function clickPoints(scoreBase, reactionMs, combo) {
  const speedBonus = Math.max(80, scoreBase - reactionMs);
  const comboMultiplier = Math.min(2, 1 + combo * 0.05);
  return Math.round(speedBonus * comboMultiplier);
}

export const CLICK_MISS_PENALTY = 120;

// ---- キーボード練習
// 成果は「1キーあたり何秒か」と「正確さ」で示す。
// お題の長さ（1文字〜文章）が違っても比べられるよう、正解したお題の合計時間を
// 打ったキー数で割る。

export function keyboardPace(roundTimes, correctChars) {
  const totalMs = roundTimes.reduce((sum, value) => sum + value, 0);
  if (correctChars === 0 || totalMs === 0) {
    return null;
  }
  return {
    secPerKey: totalMs / correctChars / 1000,
    perMinute: Math.round(correctChars / (totalMs / 60000))
  };
}

// 正解は「お題」単位、ミスは「キー」単位で数えているので、キー単位にそろえて比べる
export function keyAccuracyRate(correctChars, miss) {
  return accuracyRate(correctChars, miss);
}

// 切り捨てて、ミスが1回でもあれば 100% と表示しない
export function keyAccuracyPercent(correctChars, miss) {
  return Math.floor(keyAccuracyRate(correctChars, miss) * 100);
}

export function kpmLevelIndex(levels, kpm) {
  let index = 0;
  levels.forEach((level, i) => {
    if (kpm >= level.min) index = i;
  });
  return index;
}

export function formatKpmRange(levels, index) {
  const next = levels[index + 1];
  return next ? `${levels[index].min}〜${next.min - 1}` : `${levels[index].min}〜`;
}

// ---- 総合演習のスコア（速度 60 点 + 正確さ 40 点）

function total(speedScore, accuracyScore) {
  return Math.max(0, Math.min(100, speedScore + accuracyScore));
}

export function comprehensiveMouseScore({ success, miss, actionTimes, durationSeconds }) {
  const minutes = durationSeconds / 60;
  const rate = accuracyRate(success, miss);
  const apm = Math.round((success / minutes) * 10) / 10;
  const avgActionMs = average(actionTimes);
  const speedScore = Math.min(60, Math.round((apm / 30) * 60));
  const accuracyScore = Math.round(rate * 40);

  return {
    totalScore: total(speedScore, accuracyScore),
    summary: "速度 60 点 + 正確さ 40 点",
    metrics: [
      { label: "成功回数", value: `${success} 回` },
      { label: "失敗回数", value: `${miss} 回` },
      { label: "APM", value: `${apm}` },
      { label: "正確率", value: `${Math.round(rate * 100)}%` },
      { label: "平均操作時間", value: avgActionMs > 0 ? `${avgActionMs} ms` : "-" }
    ],
    note: "APM は 1 分あたりの成功操作数です。30 APM を満点基準、正確率を 40 点満点として合算しています。"
  };
}

// levels: KPM の目安（おとな／こども）、paceText: 「1キーあたりの時間」の表示
export function comprehensiveKeyboardScore({ success, miss, correctChars, durationSeconds, levels, paceText }) {
  const minutes = durationSeconds / 60;
  const rate = keyAccuracyRate(correctChars, miss);
  const kpm = Math.round((correctChars / minutes) * 10) / 10;
  const speedScore = Math.min(60, Math.round((kpm / 180) * 60));
  const accuracyScore = Math.round(rate * 40);
  const level = levels[kpmLevelIndex(levels, kpm)];

  return {
    totalScore: total(speedScore, accuracyScore),
    summary: "速度 60 点 + 正確さ 40 点",
    metrics: [
      { label: "正解回数", value: `${success} 回` },
      { label: "不正解回数", value: `${miss} 回` },
      { label: "1分あたりのキー数（KPM）", value: `${kpm}` },
      { label: "正確率", value: `${Math.round(rate * 100)}%` },
      { label: "1キーあたりの時間", value: paceText },
      { label: "KPM の目安", value: `${level.name}（${level.desc}）` }
    ],
    note: `KPM は 1 分間に正しく打てたキーの数です。180 KPM を満点基準にしています。目安: ${levels.map((l, i) => `${l.name} ${formatKpmRange(levels, i)}`).join(" ／ ")}`
  };
}
