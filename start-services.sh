#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Blog App Services...${NC}"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Ensure a sane PATH for launchd (homebrew on macOS can be in different locations)
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# Resolve full paths for brew and npm to avoid PATH issues when run by launchd
BREW_BIN="$(command -v brew || true)"
NPM_BIN="$(command -v npm || true)"

echo -e "${YELLOW}Using brew: ${BREW_BIN:-(not found)}${NC}"
echo -e "${YELLOW}Using npm: ${NPM_BIN:-(not found)}${NC}"

# Start MongoDB if brew is available
echo -e "${YELLOW}Starting MongoDB...${NC}"
if [ -n "$BREW_BIN" ]; then
    "$BREW_BIN" services start mongodb-community 2>/dev/null && echo -e "${GREEN}✓ MongoDB started${NC}" || echo -e "${RED}✗ MongoDB failed to start via brew services${NC}"
else
    echo -e "${RED}✗ brew not found in PATH. Install Homebrew or update PATH in the plist/script.${NC}"
fi

# Wait a moment for MongoDB to fully start
sleep 2

# Start Backend Server
echo -e "${YELLOW}Starting Backend Server...${NC}"
cd "$SCRIPT_DIR/backend" || { echo -e "${RED}Cannot cd to backend directory${NC}"; exit 1; }

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    if [ -n "$NPM_BIN" ]; then
        "$NPM_BIN" install
    else
        echo -e "${RED}npm not found. Please ensure Node.js is installed and npm is on PATH.${NC}"
        exit 1
    fi
fi

# Start the backend server in the background using resolved npm
if [ -n "$NPM_BIN" ]; then
    # Use nohup so process stays running after this script exits
    nohup "$NPM_BIN" start > "$SCRIPT_DIR/backend.log" 2>&1 &
    BACKEND_PID=$!
    sleep 1
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
        echo -e "${GREEN}Backend logs: $SCRIPT_DIR/backend.log${NC}"
    else
        echo -e "${RED}✗ Backend failed to start. Check $SCRIPT_DIR/backend.log for errors.${NC}"
    fi
else
    echo -e "${RED}npm not found. Cannot start backend.${NC}"
fi

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}Services start script finished.${NC}"
echo -e "${GREEN}MongoDB: http://localhost:27017${NC}"
echo -e "${GREEN}Backend: http://localhost:8000${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e "${YELLOW}Now run 'npm run dev' in the project root to start Vite frontend (if desired).${NC}"
