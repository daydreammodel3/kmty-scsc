// キーボード練習のお題。text は画面に出す表記、hira は読み（ローマ字の判定に使う）。
import { randomBetween } from "./util.js";

export const PROMPTS_BY_LEVEL = {
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

function isSamePrompt(a, b) {
  if (!a || !b) {
    return false;
  }
  return a.text === b.text && a.hira === b.hira;
}

// レベルのお題から1つ選ぶ。exclude を渡すと、なるべく同じお題が続かないようにする。
export function pickPrompt(level, excludePrompt = null) {
  const samples = PROMPTS_BY_LEVEL[level];
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
