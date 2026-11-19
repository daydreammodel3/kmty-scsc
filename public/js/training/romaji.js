// ひらがなのお題を、ローマ字入力の判定に使える形にする。画面には触らない。
//
// お題は「入力単位（トークン）」に分け、トークンごとに許す打ち方を並べる
// （例: し → shi / si / ci）。入力途中の文字列が、どこまで正しいか・次に押せるキーは何かを判定する。

export function normalizeText(text) {
  return text.toLowerCase();
}

// ひらがな1文字（または拗音などの組み合わせ）ごとの入力候補。先頭が表示用の標準表記。
const kanaRomajiTable = {
  "あ": ["a"], "い": ["i", "yi"], "う": ["u", "wu", "whu"], "え": ["e"], "お": ["o"],
  "か": ["ka", "ca"], "き": ["ki"], "く": ["ku", "cu", "qu"], "け": ["ke"], "こ": ["ko", "co"],
  "さ": ["sa"], "し": ["shi", "si", "ci"], "す": ["su"], "せ": ["se", "ce"], "そ": ["so"],
  "た": ["ta"], "ち": ["chi", "ti"], "つ": ["tsu", "tu"], "て": ["te"], "と": ["to"],
  "な": ["na"], "に": ["ni"], "ぬ": ["nu"], "ね": ["ne"], "の": ["no"],
  "は": ["ha"], "ひ": ["hi"], "ふ": ["fu", "hu"], "へ": ["he"], "ほ": ["ho"],
  "ま": ["ma"], "み": ["mi"], "む": ["mu"], "め": ["me"], "も": ["mo"],
  "や": ["ya"], "ゆ": ["yu"], "よ": ["yo"],
  "ら": ["ra"], "り": ["ri"], "る": ["ru"], "れ": ["re"], "ろ": ["ro"],
  "わ": ["wa"], "を": ["wo"],
  "が": ["ga"], "ぎ": ["gi"], "ぐ": ["gu"], "げ": ["ge"], "ご": ["go"],
  "ざ": ["za"], "じ": ["ji", "zi"], "ず": ["zu"], "ぜ": ["ze"], "ぞ": ["zo"],
  "だ": ["da"], "ぢ": ["di"], "づ": ["du"], "で": ["de"], "ど": ["do"],
  "ば": ["ba"], "び": ["bi"], "ぶ": ["bu"], "べ": ["be"], "ぼ": ["bo"],
  "ぱ": ["pa"], "ぴ": ["pi"], "ぷ": ["pu"], "ぺ": ["pe"], "ぽ": ["po"],
  "ぁ": ["xa", "la"], "ぃ": ["xi", "li"], "ぅ": ["xu", "lu"], "ぇ": ["xe", "le"], "ぉ": ["xo", "lo"],
  "ゃ": ["xya", "lya"], "ゅ": ["xyu", "lyu"], "ょ": ["xyo", "lyo"], "ゎ": ["xwa", "lwa"],
  "っ": ["xtu", "ltu", "xtsu", "ltsu"],
  "きゃ": ["kya"], "きゅ": ["kyu"], "きょ": ["kyo"],
  "しゃ": ["sha", "sya"], "しゅ": ["shu", "syu"], "しぇ": ["she", "sye"], "しょ": ["sho", "syo"],
  "ちゃ": ["cha", "tya", "cya"], "ちゅ": ["chu", "tyu", "cyu"], "ちぇ": ["che", "tye", "cye"], "ちょ": ["cho", "tyo", "cyo"],
  "にゃ": ["nya"], "にゅ": ["nyu"], "にょ": ["nyo"],
  "ひゃ": ["hya"], "ひゅ": ["hyu"], "ひょ": ["hyo"],
  "みゃ": ["mya"], "みゅ": ["myu"], "みょ": ["myo"],
  "りゃ": ["rya"], "りゅ": ["ryu"], "りょ": ["ryo"],
  "ぎゃ": ["gya"], "ぎゅ": ["gyu"], "ぎょ": ["gyo"],
  "じゃ": ["ja", "zya", "jya"], "じゅ": ["ju", "zyu", "jyu"], "じぇ": ["je", "zye", "jye"], "じょ": ["jo", "zyo", "jyo"],
  "ぢゃ": ["dya"], "ぢゅ": ["dyu"], "ぢょ": ["dyo"],
  "びゃ": ["bya"], "びゅ": ["byu"], "びょ": ["byo"],
  "ぴゃ": ["pya"], "ぴゅ": ["pyu"], "ぴょ": ["pyo"],
  "ふぁ": ["fa"], "ふぃ": ["fi"], "ふぇ": ["fe"], "ふぉ": ["fo"],
  "てぃ": ["thi"], "でぃ": ["dhi"], "うぃ": ["wi"], "うぇ": ["we"],
  "ー": ["-"], "。": ["."], "、": [","], "！": ["!"], "？": ["?"],
  "「": ["["], "」": ["]"], "（": ["("], "）": [")"], "・": ["/"], "～": ["~"], "　": [" "], " ": [" "]
};

const smallKanaSet = new Set(["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ"]);

function uniqueList(list) {
  return [...new Set(list)];
}

function getKanaOptions(kana) {
  const direct = kanaRomajiTable[kana];
  if (kana.length === 1) {
    return direct ? [...direct] : [normalizeText(kana)];
  }
  // 拗音などは「き」+「ゃ」(ki + xya) のような分割入力も許可する
  const split = [];
  const firstOpts = getKanaOptions(kana[0]);
  const secondOpts = getKanaOptions(kana.slice(1));
  firstOpts.forEach((a) => secondOpts.forEach((b) => split.push(a + b)));
  return uniqueList([...(direct || []), ...split]);
}

// ひらがな文字列を入力単位（トークン）に分割し、各トークンの入力候補を求める
export function buildRomajiTokens(hira) {
  const chars = [...hira];
  const units = [];
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    const next = chars[i + 1];
    if (next && smallKanaSet.has(next) && kanaRomajiTable[ch + next]) {
      units.push(ch + next);
      i += 1;
    } else {
      units.push(ch);
    }
  }

  const tokens = new Array(units.length);
  for (let i = units.length - 1; i >= 0; i -= 1) {
    const unit = units[i];
    const nextToken = tokens[i + 1];
    let options;

    if (unit === "ん") {
      // 「ん」は本来 nn。直後が子音（母音・y・n 以外）で始まる場合だけ n 1回で省略できる
      options = ["nn", "xn"];
      const canOmit = nextToken && nextToken.options.every((opt) => /^[bcdfghjklmpqrstvwxz]/.test(opt));
      if (canOmit) {
        options.unshift("n");
      }
    } else if (unit === "っ" && nextToken && nextToken.options.some((opt) => /^[bcdfghjkmpqrstvwxyz]/.test(opt))) {
      // 促音は次の子音を重ねる（例: がっこう → gakkou）。単独入力(xtu/ltu)も許可
      const doubled = nextToken.options
        .filter((opt) => /^[bcdfghjkmpqrstvwxyz]/.test(opt))
        .map((opt) => opt[0]);
      options = uniqueList([...doubled, ...getKanaOptions("っ")]);
    } else {
      options = getKanaOptions(unit);
    }

    tokens[i] = { kana: unit, options };
  }

  // 表示用の標準表記（促音は次の子音を重ねた形、ん は省略可能なら n）
  tokens.forEach((token) => {
    token.display = token.options[0];
  });
  tokens.forEach((token, idx) => {
    if (token.kana === "っ" && tokens[idx + 1]) {
      token.display = tokens[idx + 1].display[0];
    }
  });

  return tokens;
}

export function getRomajiDisplay(tokens) {
  return tokens.map((token) => token.display).join("");
}

// 入力途中の文字列を判定する。valid: ここまで正しい / complete: 入力完了 / nextChars: 次に押せるキー候補
export function matchRomajiInput(tokens, typed) {
  const nextChars = new Set();
  let valid = false;
  let complete = false;
  const visited = new Set();

  const walk = (ti, pos) => {
    const key = `${ti}:${pos}`;
    if (visited.has(key)) {
      return;
    }
    visited.add(key);

    if (pos === typed.length) {
      valid = true;
      if (ti === tokens.length) {
        complete = true;
        return;
      }
      tokens[ti].options.forEach((opt) => nextChars.add(opt[0]));
      return;
    }
    if (ti === tokens.length) {
      return;
    }

    const rest = typed.slice(pos);
    tokens[ti].options.forEach((opt) => {
      if (rest.startsWith(opt)) {
        walk(ti + 1, pos + opt.length);
      } else if (opt.startsWith(rest)) {
        valid = true;
        nextChars.add(opt[rest.length]);
      }
    });
  };

  walk(0, 0);
  return { valid, complete, nextChars: [...nextChars] };
}
