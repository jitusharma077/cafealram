#!/bin/bash
echo "Starting Backend Server..."
node server.js &
SERVER_PID=$!

echo "Starting Frontend (Network Accessible)..."
npm run dev:host &
FRONTEND_PID=$!

cleanup() {
    echo "Stopping servers..."
    kill $SERVER_PID
    kill $FRONTEND_PID
}

trap cleanup EXIT INT TERM

wait $SERVER_PID $FRONTEND_PID
