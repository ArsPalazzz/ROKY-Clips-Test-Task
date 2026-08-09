#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
REQUESTS="${REQUESTS:-10}"
PARALLEL="${PARALLEL:-10}"
PAYMENT_ID="${PAYMENT_ID:-abc-123}"
USER_ID="${USER_ID:-1}"
AMOUNT="${AMOUNT:-4900}"
STATUS="${STATUS:-CONFIRMED}"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

payload="{\"payment_id\":\"${PAYMENT_ID}\",\"user_id\":${USER_ID},\"amount\":${AMOUNT},\"status\":\"${STATUS}\"}"

echo "Sending ${REQUESTS} parallel webhook requests to ${BASE_URL}/webhook/payment"
echo "payment_id=${PAYMENT_ID}, user_id=${USER_ID}, amount=${AMOUNT}, status=${STATUS}"
echo

running=0
for i in $(seq "$REQUESTS"); do
  curl -s -X POST "${BASE_URL}/webhook/payment" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    > "${TMP_DIR}/${i}.json" &

  running=$((running + 1))
  if [ "$running" -ge "$PARALLEL" ]; then
    wait -n
    running=$((running - 1))
  fi
done
wait

processed=0
duplicate=0

for i in $(seq "$REQUESTS"); do
  file="${TMP_DIR}/${i}.json"
  cat "$file"
  echo

  if grep -qF '"processed":true' "$file"; then
    processed=$((processed + 1))
  fi

  if grep -qF '"duplicate":true' "$file"; then
    duplicate=$((duplicate + 1))
  fi
done

echo "---"
echo "processed: ${processed}"
echo "duplicate: ${duplicate}"
