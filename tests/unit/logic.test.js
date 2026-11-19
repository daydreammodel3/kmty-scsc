// キーの案内・点数・お題選び。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { KPM_LEVELS } from "../../public/js/training/data.js";
import { getTypingGuideHint } from "../../public/js/training/keys.js";
import { pickPrompt, PROMPTS_BY_LEVEL } from "../../public/js/training/prompts.js";
import {
  accuracyRate, clickPoints, comprehensiveKeyboardScore, comprehensiveMouseScore, formatKpmRange,
  getRoundConfig, getScoreRank, keyAccuracyPercent, keyboardPace, kpmLevelIndex
} from "../../public/js/training/scoring.js";

const golden = JSON.parse(readFileSync(new URL("./golden.json", import.meta.url)));

test("押すキーと指の案内が以前と同じ", () => {
  for (const [char, expected] of golden.hints) {
    assert.deepEqual(getTypingGuideHint(char), expected, JSON.stringify(char));
  }
  // Shift は文字と反対の手で押す
  assert.equal(getTypingGuideHint("!").label, "右Shift + 1");
  assert.equal(getTypingGuideHint("?").label, "左Shift + /");
});

test("ランクの区切り", () => {
  for (const [score, rank] of golden.ranks) {
    assert.equal(getScoreRank(score), rank, String(score));
  }
});

test("クリック練習の得点とラウンド設定", () => {
  assert.equal(clickPoints(520, 300, 1), Math.round(220 * 1.05));
  assert.equal(clickPoints(520, 900, 1), Math.round(80 * 1.05)); // 遅くても最低 80 点
  assert.equal(clickPoints(980, 100, 40), 880 * 2);              // コンボ倍率は最大 2 倍
  assert.equal(getRoundConfig(4).size, 88);
  assert.equal(getRoundConfig(5).size, 66);
  assert.equal(getRoundConfig(9).move, true);
});

test("キーボードの速さと正確さ", () => {
  assert.equal(keyboardPace([], 0), null);
  assert.deepEqual(keyboardPace([3000, 3000], 12), { secPerKey: 0.5, perMinute: 120 });
  assert.equal(accuracyRate(0, 0), 0);
  assert.equal(keyAccuracyPercent(99, 1), 99);
  assert.equal(keyAccuracyPercent(199, 1), 99); // 99.5% でも 100% とは出さない
  assert.equal(kpmLevelIndex(KPM_LEVELS, 0), 0);
  assert.equal(kpmLevelIndex(KPM_LEVELS, 199), 1);
  assert.equal(kpmLevelIndex(KPM_LEVELS, 400), 4);
  assert.equal(formatKpmRange(KPM_LEVELS, 1), "100〜199");
  assert.equal(formatKpmRange(KPM_LEVELS, 4), "400〜");
});

test("総合演習のスコア", () => {
  const mouse = comprehensiveMouseScore({ success: 60, miss: 0, actionTimes: [500, 700], durationSeconds: 120 });
  assert.equal(mouse.totalScore, 100);
  assert.equal(mouse.metrics[4].value, "600 ms");
  const none = comprehensiveMouseScore({ success: 0, miss: 0, actionTimes: [], durationSeconds: 120 });
  assert.equal(none.totalScore, 0);
  assert.equal(none.metrics[4].value, "-");

  const kb = comprehensiveKeyboardScore({ success: 10, miss: 10, correctChars: 360, durationSeconds: 120, levels: KPM_LEVELS, paceText: "約0.3秒" });
  // KPM 180 で速度 60 点、正確さ 360/370 で 39 点
  assert.equal(kb.totalScore, 99);
  assert.equal(kb.metrics[2].value, "180");
  assert.equal(kb.metrics[5].value, "一般（普段使いなら十分）");
});

test("お題選び: 直前と同じお題は続けて出さない", () => {
  const prompts = PROMPTS_BY_LEVEL.symbol;
  for (let i = 0; i < 200; i += 1) {
    const previous = prompts[i % prompts.length];
    assert.notDeepEqual(pickPrompt("symbol", previous), previous);
  }
  assert.equal(pickPrompt("unknown"), null);
});
