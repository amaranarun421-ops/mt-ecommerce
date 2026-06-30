#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

if ! command -v bun >/dev/null 2>&1; then
  echo "ERROR: bun is not installed or not in PATH"
  exit 1
fi

echo "=========================================="
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Installing root deps..."
echo "=========================================="
bun install

echo "=========================================="
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Installing client deps..."
echo "=========================================="
cd "$PROJECT_DIR/client"
bun install

echo "=========================================="
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Installing server deps..."
echo "=========================================="
cd "$PROJECT_DIR/server"
bun install

echo "=========================================="
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Seeding database (server must start first)..."
echo "=========================================="
cd "$PROJECT_DIR/server"
# Start server briefly to seed, then kill
( bun run dev > "$PROJECT_DIR/.zscripts/server-seed.log" 2>&1 & )
SERVER_PID=$!
echo "Server PID for seeding: $SERVER_PID"

# Wait for server to be ready
attempt=1
while [ "$attempt" -le 30 ]; do
  if curl -s --connect-timeout 2 --max-time 5 "http://localhost:4000/api/health" >/dev/null 2>&1; then
    echo "Server is ready, seeding..."
    break
  fi
  sleep 1
  attempt=$((attempt + 1))
done

bun run seed || echo "Seed completed with notes"

echo "=========================================="
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting dev (client on :3000, server on :4000)..."
echo "=========================================="
cd "$PROJECT_DIR"
bun run dev &
DEV_PID=$!

# Wait for client to be ready
attempt=1
while [ "$attempt" -le 60 ]; do
  if curl -s --connect-timeout 2 --max-time 5 "http://localhost:3000" >/dev/null 2>&1; then
    echo "Client ready!"
    break
  fi
  sleep 1
  attempt=$((attempt + 1))
done

echo "Dev stack is up. Client: http://localhost:3000  Server: http://localhost:4000"
disown "$DEV_PID" 2>/dev/null || true
unset DEV_PID
