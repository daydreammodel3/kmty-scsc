# kmty-SCSC

Keyboard and Mouse Training Yard as Small, Cute, Stylized Characters.（「Y」は仮）

小さくてかわいいキャラクターと一緒に、マウス（クリック・ダブルクリック・ドラッグ&ドロップ）とキーボード入力を練習できる静的サイトです。

- サーバー・データベース・ログインは使いません。練習の記録は外部へ送りません（CSP で `connect-src 'none'`）。
- キャラクター（もち・ねこ・ひよこ・ふくろう先生）は、このサイトのために描いたオリジナルの SVG です（`public/js/characters.js`）。
- **おとな（中学生以上）／こども（小学生まで）** をヘッダーで切り替えられます。こどもモードでは漢字の練習を出さず、文章の問題や説明もひらがなで表示します。選んだモードはブラウザーに保存されます（保存できない環境でも、そのページを開いている間は有効です）。
- フォント: BIZ UDPゴシック（ユニバーサルデザインフォント、SIL Open Font License 1.1、`public/fonts/OFL.txt`）。

## 構成

```
public/                 Firebase Hosting で配信するファイル
  index.html
  css/  js/
  fonts/                サイトで使う文字だけに絞ったフォント（自動生成）
fonts-src/              絞り込み前のフォント（配信しない）
tools/subset_fonts.py   フォントの絞り込み
firebase.json           配信設定（セキュリティヘッダー・キャッシュ）
```

## サイト名の変更

`public/js/site_config.js` の `name` と `tagline` を書き換えます。`index.html` の `<title>` と見出しの初期表示も合わせて変えてください。

## 文言や練習問題を変えたとき（フォントの作り直し）

`public/fonts/` には、サイトで使う文字（かな・英数字・記号と、HTML/JS/CSS に書かれた漢字）だけが入っています。文言や問題を増やしたら作り直してください。

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
