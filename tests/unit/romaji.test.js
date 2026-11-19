// ローマ字の判定。golden.json は、分割前のコード（basic_ops_training.js）から取った正解データ。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PROMPTS_BY_LEVEL } from "../../public/js/training/prompts.js";
import { buildRomajiTokens, getRomajiDisplay, matchRomajiInput } from "../../public/js/training/romaji.js";

const golden = JSON.parse(readFileSync(new URL("./golden.json", import.meta.url)));

test("すべてのお題で、表示用のローマ字と入力候補が以前と同じ", () => {
  for (const [level, prompts] of Object.entries(golden.prompts)) {
    assert.equal(PROMPTS_BY_LEVEL[level].length, prompts.length, level);
    prompts.forEach((expected, i) => {
      assert.equal(PROMPTS_BY_LEVEL[level][i].hira, expected.hira);
      const tokens = buildRomajiTokens(expected.hira);
      assert.equal(getRomajiDisplay(tokens), expected.display, expected.hira);
      assert.deepEqual(tokens.map((t) => [t.kana, t.options]), expected.tokens, expected.hira);
    });
  }
});

test("入力途中の判定（正しいか・完了か・次のキー）が以前と同じ", () => {
  for (const { hira, results } of golden.matches) {
    const tokens = buildRomajiTokens(hira);
    for (const [typed, expected] of results) {
      assert.deepEqual(matchRomajiInput(tokens, typed), expected, `${hira} / "${typed}"`);
    }
  }
});

test("よくある打ち方", () => {
  const check = (hira, typed, complete) => {
    const result = matchRomajiInput(buildRomajiTokens(hira), typed);
    assert.equal(result.valid && result.complete, complete, `${hira} / ${typed}`);
  };
  check("がっこう", "gakkou", true);            // 促音は次の子音を重ねる
  check("がっこう", "gaxtukou", true);          // 小さい「っ」を単独で打ってもよい
  check("しんかんせん", "sinkansen", false);     // 最後の「ん」は nn が必要
  check("しんかんせん", "shinkansenn", true);    // 子音の前の「ん」は n 1 回でよい
  check("こんにちは", "konichiha", false);       // な行の前の「ん」は省略できない
  check("きゃ", "kixya", true);                  // 拗音は分けて打ってもよい
  assert.equal(getRomajiDisplay(buildRomajiTokens("がっこう")), "gakkou");
});
