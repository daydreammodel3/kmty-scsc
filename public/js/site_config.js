// サイト名はここ1か所で決める。決まったら name / tagline を書き換えるだけでよい。
window.SITE_CONFIG = {
  name: "kmty-SCSC",
  // "Y" は仮。決まったらここだけ書き換える。
  tagline: "Keyboard and Mouse Training Yard as Small, Cute, Stylized Characters."
};

(function applySiteName() {
  const { name, tagline } = window.SITE_CONFIG;
  document.title = `${name} — マウスとキーボードの練習`;
  document.querySelectorAll("[data-site-name]").forEach((el) => { el.textContent = name; });
  document.querySelectorAll("[data-site-tagline]").forEach((el) => { el.textContent = tagline; });

  // ページ下のクレジット。ほかの SCSC シリーズと同じく、略称のもとになった頭文字を太字にする。
  // （大文字で始まる単語の1文字目。例: <b>K</b>eyboard and <b>M</b>ouse ...）
  document.querySelectorAll("[data-site-credit]").forEach((el) => {
    el.textContent = "";
    const abbr = document.createElement("abbr");
    abbr.title = tagline;
    abbr.textContent = name;
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
