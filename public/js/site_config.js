// サイト名はここ1か所で決める。
window.SITE_CONFIG = {
  // 画面に出すサイト名（ヘッダーとタブのタイトル）
  name: "キーボードとマウスのひろば",
  // 狭い画面で折り返してよい切れ目（つなげると name になるように分ける）
  nameParts: ["キーボードと", "マウスのひろば"],
  // 略称。ページ下のクレジットに、もとになった英語と並べて出す（ほかの SCSC シリーズと同じ形）
  code: "kmty-SCSC",
  tagline: "Keyboard and Mouse Training Yard as Small, Cute, Stylized Characters."
};

(function applySiteName() {
  const { name, nameParts = [name], code, tagline } = window.SITE_CONFIG;
  document.title = name;
  // 語の途中（「ひろ／ば」など）で折り返さないよう、切れ目ごとに折り返し禁止のかたまりにする
  document.querySelectorAll("[data-site-name]").forEach((el) => {
    el.replaceChildren(...nameParts.map((part) => {
      const span = document.createElement("span");
      span.className = "nowrap";
      span.textContent = part;
      return span;
    }));
  });
  document.querySelectorAll("[data-site-tagline]").forEach((el) => { el.textContent = tagline; });

  // ページ下のクレジット。ほかの SCSC シリーズと同じく、略称のもとになった頭文字を太字にする。
  // （大文字で始まる単語の1文字目。例: <b>K</b>eyboard and <b>M</b>ouse ...）
  document.querySelectorAll("[data-site-credit]").forEach((el) => {
    el.textContent = "";
    const abbr = document.createElement("abbr");
    abbr.title = tagline;
    abbr.textContent = code;
    el.append(abbr, " — ");
    tagline.split(/(\s+)/).forEach((word) => {
      if (/^[A-Z]/.test(word)) {
        const b = document.createElement("b");
        b.textContent = word[0];
        el.append(b, word.slice(1));
      } else {
        el.append(word);
      }
    });
  });
})();
