#!/bin/sh
# 練習画面の動作が、記録（tests/e2e/expected.jsonl）と同じかを確かめる。
# 文言や動きを意図して変えたときは、確認したうえで記録を作り直す:
#   sh tests/e2e/check.sh --update
set -eu
cd "$(dirname "$0")/../.."
PORT=8765
python3 -m http.server "$PORT" --directory public >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1
OUT=$(mktemp)
node tests/e2e/record.cjs "http://localhost:$PORT/" "$OUT"
if [ "${1:-}" = "--update" ]; then
  cp "$OUT" tests/e2e/expected.jsonl
  echo "tests/e2e/expected.jsonl を更新しました"
elif cmp -s "$OUT" tests/e2e/expected.jsonl; then
  echo "OK: 記録と同じ動作です"
else
  echo "NG: 記録と違います（diff $OUT tests/e2e/expected.jsonl で確認）"
  exit 1
fi
