// 練習画面の動作を記録する（リファクタリングの前後で同じ結果になるかを確かめるため）。
//
// 乱数（Math.random）と時計（Date・performance.now・タイマー）を固定したブラウザで、
// すべての練習を決まった手順で操作し、そのつど画面の状態を JSON Lines で書き出す。
// 同じページなら何度実行しても同じ出力になる。
//
// 使い方: npm run test:e2e（tests/e2e/check.sh が、記録 expected.jsonl と比べる）
// 単独で:  node tests/e2e/record.cjs http://localhost:8000/ out.jsonl
//
// Playwright が必要（npm i -D playwright、または入っている環境で実行）。
const { chromium } = require("playwright");
const fs = require("fs");

const [, , baseUrl = "http://localhost:8000/", outPath = "record.jsonl"] = process.argv;

// 決まった順に値を返す疑似乱数（mulberry32）
const SEED_SCRIPT = `
  (() => {
    let s = 20261119;
    Math.random = () => {
      s |= 0; s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    try { localStorage.clear(); } catch (_) {}
  })();
`;

// 画面の状態として記録するもの
function snapshot() {
  const $ = (id) => document.getElementById(id);
  const text = (id) => ($(id) ? $(id).textContent.trim().replace(/\s+/g, " ") : null);
  const ids = [
    "sessionText", "phaseText", "statusText", "roundMetric", "missMetric", "avgMetric", "bestMetric",
    "scoreMetric", "comboMetric", "timeMetric", "resultText",
    "doubleStatus", "doubleRoundMetric", "doubleMissMetric", "doubleAvgMetric", "doubleResult",
    "dragStatus", "dragRoundMetric", "dragMissMetric", "dragTimeMetric", "dragResult",
    "compMousePhaseText", "compMouseStatus", "compMouseTimeMetric", "compMouseRoundMetric",
    "compMouseMissMetric", "compMouseResult",
    "keyboardStatus", "typingPromptText", "typingPromptHira", "typingPromptRoma", "typingGuideText",
    "typingRoundMetric", "typingMissMetric", "typingAvgMetric", "typingAccuracyMetric", "typingResult",
    "kpmScale", "heroTitle"
  ];
  const state = {};
  ids.forEach((id) => { state[id] = text(id); });
  const resultIds = ["resultText", "doubleResult", "dragResult", "compMouseResult", "typingResult"];
  state.resultClass = resultIds.map((id) => $(id).className);
  state.buttons = [...document.querySelectorAll("button")]
    .map((b) => `${b.id || b.dataset.audienceBtn || b.dataset.level || "?"}:${b.textContent.trim()}:${b.disabled ? "D" : ""}${b.classList.contains("active") ? "A" : ""}${b.hidden ? "H" : ""}${b.getAttribute("aria-pressed") || ""}`);
  state.panes = [...document.querySelectorAll(".exercise-pane")].map((p) => `${p.id}:${p.classList.contains("active") ? 1 : 0}`);
  state.menus = ["mouseSubMenu", "keyboardSubMenu", "comprehensiveSubMenu"].map((id) => $(id).style.display);
  state.positions = ["target", "doubleIcon", "dragSourceWrap", "dropZone", "compMouseTarget",
    "compMouseDoubleIcon", "compMouseDragSourceWrap", "compMouseDropZone"]
    .map((id) => { const s = $(id).style; return `${id}:${s.display}|${s.left}|${s.top}|${s.width}|${s.height}`; });
  state.progress = $("progressBar").style.width;
  state.typingInput = `${$("typingInput").value}|${$("typingInput").className}`;
  state.activeKeys = [...document.querySelectorAll(".kbd-key.active")].map((k) => k.dataset.key);
  state.activeFingers = [...document.querySelectorAll(".finger.active")].map((f) => f.dataset.finger);
  state.keyboardShift = $("keyboardVisual").className;
  state.keyboardHtmlLength = $("keyboardVisual").innerHTML.length;
  state.overlays = [...document.querySelectorAll(".countdown-overlay")].map((o) => `${o.className}:${o.textContent}`);
  state.scoreOverlay = $("scoreOverlay").hidden ? "hidden" : $("scoreOverlay").textContent.trim().replace(/\s+/g, " ");
  state.audience = document.body.dataset.audience;
  state.kidsTexts = [...document.querySelectorAll("[data-kids-text]")].map((el) => el.textContent.trim()).join("|");
  state.toast = document.querySelector(".chara-toast")?.className;
  state.owl = document.querySelector(".owl-guide-bubble")?.textContent;
  return state;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.clock.install({ time: new Date("2026-11-19T00:00:00Z") });
  await page.addInitScript(SEED_SCRIPT);
  await page.goto(baseUrl);
  // ここから先は、runFor で進めたぶんだけ時間が進む（実時間では進まない）
  await page.clock.pauseAt(new Date("2026-11-19T00:00:05Z"));
  await page.clock.runFor(100);

  const out = [];
  const snap = async (label) => out.push(JSON.stringify({ label, ...(await page.evaluate(snapshot)) }));
  const run = (ms) => page.clock.runFor(ms);
  const click = (sel) => page.evaluate((s) => document.querySelector(s).click(), sel);
  const fire = (sel, type, Ctor = "MouseEvent") =>
    page.evaluate(([s, t, c]) => document.querySelector(s).dispatchEvent(new window[c](t, { bubbles: true, cancelable: true })), [sel, type, Ctor]);
  const typeValue = (value) => page.evaluate((v) => {
    const input = document.getElementById("typingInput");
    input.value = v;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
  const text = (id) => page.evaluate((i) => document.getElementById(i).textContent, id);

  await snap("initial");

  // ---- クリック練習（ミスを混ぜ、動くもちのフェーズまで）
  await click("#startBtn");
  await run(1000); await snap("click:countdown");
  await run(2400);
  for (let r = 1; r <= 12; r += 1) {
    await run(1000);
    if (r === 2 || r === 9) { await click("#arena"); await snap(`click:miss${r}`); }
    await run(150 + r * 20);
    await click("#target");
    await snap(`click:round${r}`);
  }
  await run(2500); await snap("click:done");

  // ---- ダブルクリック練習（遅すぎる 1 回を含む）
  await click("#modeDoubleBtn"); await snap("double:menu");
  await click("#doubleStartBtn"); await run(3100); await snap("double:started");
  for (let i = 0; i < 6; i += 1) {
    if (i === 2) { await fire("#doubleIcon", "mousedown"); await run(700); }
    await fire("#doubleIcon", "mousedown"); await run(120);
    await fire("#doubleIcon", "mousedown"); await fire("#doubleIcon", "dblclick");
    await run(50); await snap(`double:${i}`);
  }
  await run(2500); await snap("double:done");

  // ---- ドラッグ練習（外に落とす 1 回を含む）
  await click("#modeDragBtn"); await snap("drag:menu");
  await click("#dragStartBtn"); await run(3100); await snap("drag:started");
  for (let i = 0; i < 5; i += 1) {
    if (i === 1) { await fire("#dragItem", "dragstart", "DragEvent"); await run(300); await fire("#dragItem", "dragend", "DragEvent"); await snap("drag:miss"); }
    await fire("#dragItem", "dragstart", "DragEvent"); await run(400 + i * 50);
    await fire("#dropZone", "dragover", "DragEvent"); await fire("#dropZone", "drop", "DragEvent");
    await fire("#dragItem", "dragend", "DragEvent");
    await snap(`drag:${i}`);
  }
  await run(2500); await snap("drag:done");

  // ---- キーボード練習（ひらがな 12 問。打ち間違い・途中の状態も記録）
  await click("#catKeyboardBtn"); await snap("kb:menu");
  for (const level of ["kanji", "symbol", "sentence", "hira"]) {
    await click(`.level-btn[data-level="${level}"]`); await snap(`kb:level:${level}`);
  }
  await click("#keyboardStartBtn"); await run(3100); await snap("kb:started");
  for (let i = 0; i < 12; i += 1) {
    const roma = await text("typingPromptRoma");
    await run(300);
    if (i === 3) { await typeValue("q"); await snap("kb:wrongkey"); }
    if (roma.length > 1) { await typeValue(roma.slice(0, 1)); await snap(`kb:${i}:partial`); }
    await run(200 * roma.length);
    await typeValue(roma);
    await run(30); await snap(`kb:${i}`);
  }
  await run(2500); await snap("kb:done");

  // ---- こどもモード（漢字が隠れる・文言が変わる）
  await click('.level-btn[data-level="kanji"]');
  await click('[data-audience-btn="kids"]'); await snap("kids:on");
  await click("#keyboardStartBtn"); await run(3100); await snap("kids:started");
  for (let i = 0; i < 2; i += 1) {
    const roma = await text("typingPromptRoma");
    await run(400); await typeValue(roma); await run(30); await snap(`kids:${i}`);
  }
  await click('[data-audience-btn="adult"]'); await snap("kids:locked");

  // ---- 総合演習（マウス）
  await click("#catComprehensiveBtn"); await snap("comp:menu");
  await click("#compMouseBtn");
  await click("#compMouseStartBtn"); await run(3100); await snap("compMouse:started");
  for (let i = 0; i < 9; i += 1) {
    const phase = await text("compMousePhaseText");
    await run(500);
    if (phase.includes("ダブル")) {
      if (i === 4) { await fire("#compMouseDoubleIcon", "mousedown"); await run(700); }
      await fire("#compMouseDoubleIcon", "mousedown"); await run(100);
      await fire("#compMouseDoubleIcon", "mousedown"); await fire("#compMouseDoubleIcon", "dblclick");
    } else if (phase.includes("ドラッグ")) {
      if (i === 5) { await fire("#compMouseDragItem", "dragstart", "DragEvent"); await fire("#compMouseDragItem", "dragend", "DragEvent"); }
      await fire("#compMouseDragItem", "dragstart", "DragEvent"); await run(300);
      await fire("#compMouseDropZone", "drop", "DragEvent"); await fire("#compMouseDragItem", "dragend", "DragEvent");
    } else {
      if (i === 3) { await click("#compMouseArena"); }
      await click("#compMouseTarget");
    }
    await snap(`compMouse:${i}`);
  }
  await run(120000); await snap("compMouse:timeup");
  await run(2100); await snap("compMouse:score");
  await click("#scoreOverlayCloseBtn");

  // ---- 総合演習（キーボード、こどもモード → おとなに戻して）
  await click('[data-audience-btn="adult"]');
  await click("#compKeyboardBtn"); await snap("compKb:menu");
  await click("#keyboardStartBtn"); await run(3100); await snap("compKb:started");
  for (let i = 0; i < 3; i += 1) {
    const roma = await text("typingPromptRoma");
    await run(2000);
    if (i === 1) { await typeValue("q"); }
    await typeValue(roma); await run(30); await snap(`compKb:${i}`);
  }
  await run(120000); await snap("compKb:timeup");
  await run(2100); await snap("compKb:score");
  await click("#scoreOverlayCloseBtn"); await snap("compKb:closed");

  // ---- カテゴリの行き来
  await click("#catMouseBtn"); await snap("back:mouse");
  await click("#catComprehensiveBtn"); await snap("back:comp");

  out.push(JSON.stringify({ label: "errors", errors }));
  fs.writeFileSync(outPath, out.join("\n") + "\n");
  await browser.close();
  console.log(`${out.length} snapshots, ${errors.length} errors -> ${outPath}`);
})();
