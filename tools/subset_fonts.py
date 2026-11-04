"""BIZ UDPゴシックを、サイトで使う文字だけに絞って public/fonts/ に書き出す。

使い方（リポジトリのルートで）:
    pip install fonttools brotli
    python3 tools/subset_fonts.py

画面の文言や練習問題を増やしたら、もう一度実行してコミットする。
ここに含まれない文字（例: 漢字変換で出た別の漢字）は、端末の日本語フォントで表示される。
"""
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SRC = ROOT / "fonts-src"
OUT = PUBLIC / "fonts"

RANGES = [
    (0x0020, 0x007E),  # ASCII
    (0x00A0, 0x00FF),  # ラテン1補助（×・÷など）
    (0x2010, 0x2027),  # ダッシュ・引用符・…
    (0x2190, 0x2199),  # 矢印
    (0x25A0, 0x25CF),  # ■□▲△◆◇○●
    (0x2605, 0x2606),  # ★☆
    (0x3000, 0x303F),  # 和文の句読点・かっこ
    (0x3040, 0x309F),  # ひらがな
    (0x30A0, 0x30FF),  # カタカナ
    (0xFF01, 0xFF5E),  # 全角英数・記号
]


def site_text():
    chars = set()
    for path in PUBLIC.rglob("*"):
        if path.suffix in {".html", ".js", ".css", ".json"}:
            chars.update(path.read_text(encoding="utf-8"))
    for lo, hi in RANGES:
        chars.update(chr(c) for c in range(lo, hi + 1))
    return "".join(sorted(c for c in chars if c.isprintable()))


def main():
    text = site_text()
    OUT.mkdir(parents=True, exist_ok=True)
    for name in ("BIZUDPGothic-Regular", "BIZUDPGothic-Bold"):
        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.notdef_outline = True
        font = subset.load_font(str(SRC / f"{name}.woff2"), options)
        subsetter = subset.Subsetter(options)
        subsetter.populate(text=text)
        subsetter.subset(font)
        out = OUT / f"{name}.subset.woff2"
        subset.save_font(font, str(out), options)
        print(f"{out.relative_to(ROOT)}: {out.stat().st_size / 1024:.0f} KB")
    print(f"{len(text)} 文字")


if __name__ == "__main__":
    main()
