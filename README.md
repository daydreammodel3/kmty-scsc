# キーマウひろば（kmty-SCSC）

キーボードとマウスのれんしゅうひろば。

Keyboard and Mouse Training Yard as Small, Cute, Stylized Characters.

公開先: https://kmty.yythzy.com/ （Firebase Hosting。`https://kmty-scsc.web.app/` でも同じサイトが開きます）

小さくてかわいいキャラクターと一緒に、マウス（クリック・ダブルクリック・ドラッグ&ドロップ）とキーボード入力を練習できる静的サイトです。

- サーバー・データベース・ログインは使いません。練習の記録は外部へ送りません（CSP で `connect-src 'none'`）。
- キャラクター（もち・ねこ・ひよこ・ふくろう先生）は、このサイトのために描いたオリジナルの SVG です（`public/js/characters.js`）。
- **おとな（中学生以上）／こども（小学生まで）** をヘッダーで切り替えられます。こどもモードでは漢字の練習を出さず、文章の問題や説明もひらがなで表示します。選んだモードはブラウザーに保存されます（保存できない環境でも、そのページを開いている間は有効です）。
- デザインは SCSC シリーズ（[アルゴリズムずかん](https://visa.yythzy.com/)・[ハンドシェイクずかん](https://visp.yythzy.com/)）と共通です。色・角丸・影などは `public/css/global.css` の先頭にまとめてあり、visa-scsc・visp-scsc の `src/styles.css` と同じ値です。ページ下に、3 サイトの相互リンクがあります。
- フォント: 本文は M PLUS Rounded 1c（シリーズ共通）、入力する文字とキーの刻印は BIZ UDPゴシック（ユニバーサルデザインフォント）。どちらも SIL Open Font License 1.1（`public/fonts/OFL-*.txt`）。外部のフォント配信は使わず、自前で配信します。

## 構成

```
public/                     Firebase Hosting で配信するファイル
  index.html
  css/
  js/
    site_config.js          サイト名
    characters.js           キャラクターの絵と声かけ
    training/               練習画面（ES モジュール）
      main.js               入口。各練習を組み立てる
      data.js prompts.js    設定・キー配置・お題（画面に触らない）
      romaji.js keys.js     ローマ字の判定・押すキーと指の案内（同上）
      scoring.js            点数・正確さ・速さの計算（同上）
      ui.js audience.js keyboard-guide.js menu.js   画面の共通部品
      exercises/            練習ごとの処理（クリック・ダブルクリック・ドラッグ・総合マウス・キーボード）
  fonts/                    サイトで使う文字だけに絞ったフォント（自動生成）
fonts-src/                  絞り込み前のフォント（配信しない）
tools/subset_fonts.py       フォントの絞り込み
tests/                      テスト（配信しない）
firebase.json               配信設定（セキュリティヘッダー・キャッシュ）
```

## テスト

```sh
npm test            # ローマ字の判定・点数などのロジック（Node.js 22 以上、追加のインストール不要）
npm run test:e2e    # 練習画面を決まった手順で操作し、記録 tests/e2e/expected.jsonl と比べる（Playwright が必要）
```

`test:e2e` は、乱数と時計を固定したブラウザで全部の練習を操作し、画面の状態を記録と比べます。
文言や動きを意図して変えたときは、画面で確かめてから `sh tests/e2e/check.sh --update` で記録を作り直してください。

## サイト名の変更

`public/js/site_config.js` の `name`（画面に出す名前）・`description`（名前の下の説明）・`code`（略称）・`tagline` を書き換えます。`index.html` の `<title>`、見出しの初期表示、ページ下の相互リンクも合わせて変えてください。相互リンクは visa-scsc・visp-scsc の `src/components/SeriesLinks.tsx` にもあります。

## 文言や練習問題を変えたとき（フォントの作り直し）

`public/fonts/` には、2 種類のフォントそれぞれについて、サイトで使う文字（かな・英数字・記号と、HTML/JS/CSS に書かれた漢字。コメントの中の文字は除く）だけが入っています。文言や問題を増やしたら作り直してください。

```sh
pip install fonttools brotli
python3 tools/subset_fonts.py
```

フォントのファイル名には中身のハッシュが付き、`public/css/fonts.css` も自動で書き換わります（フォントは1年間キャッシュされるため、中身が変わったら名前も変えて、新しいファイルを読み込ませるためです）。

フォントに含まれない文字（例: 漢字変換で出た別の漢字）は、端末の日本語フォントで表示されます。

## ローカルで確認

```sh
cd public
python3 -m http.server 8000
# http://localhost:8000/ を開く
```

## Firebase Hosting へのデプロイ（無料の Spark プラン）

```sh
npm install -g firebase-tools
firebase login
firebase use --add          # Firebase コンソールで作ったプロジェクトを選ぶ
firebase deploy --only hosting
```

セキュリティヘッダーとキャッシュの設定は `firebase.json` にあります。

### カスタムドメイン

`kmty.yythzy.com` は、yythzy.com の DNS（Squarespace）に次のレコードを追加して Firebase Hosting につないでいます。

| タイプ | 名前 | データ |
|---|---|---|
| CNAME | `kmty` | `kmty-scsc.web.app` |

`www.yythzy.com`（Google Sites）や MX など、ほかのレコードには触れていません。

## ライセンス

- プログラム（HTML・CSS・JavaScript・`tools/`）とキャラクター（もち・ねこ・ひよこ・ふくろう先生、ファビコン）は **MIT ライセンス** です（`LICENSE`）。著作権表示（`Copyright (c) 2026 YYTHZYテクノロジー`）とライセンス文を残せば、商用を含めて自由に使い、改変・再配布できます。無保証です。
- フォント（`fonts-src/`、`public/fonts/` の M PLUS Rounded 1c・BIZ UDPゴシックとその抜き出し版）は **SIL Open Font License 1.1** です（`OFL-MPLUSRounded1c.txt`・`OFL-BIZUDPGothic.txt`）。MIT ライセンスの対象外です。

