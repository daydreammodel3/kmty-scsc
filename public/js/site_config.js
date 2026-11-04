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
})();
