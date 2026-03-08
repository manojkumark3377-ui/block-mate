# Setup Instructions for Automatic Startup

## Option 1: Manual Startup (Easiest - Every Time You Start Coding)

### Step 1: Make the script executable
```bash
chmod +x /Users/manojkumark/Documents/BlockMate/start-services.sh
```

### Step 2: Run it whenever you want to start services
```bash
/Users/manojkumark/Documents/BlockMate/start-services.sh
```

Then in another terminal, start the frontend:
```bash
cd /Users/manojkumark/Documents/BlockMate
npm run dev
```

---

## Option 2: Automatic Startup (On Every Login)

This will start MongoDB and backend automatically when you log in.

### Step 1: Make the script executable
```bash
chmod +x /Users/manojkumark/Documents/BlockMate/start-services.sh
```

### Step 2: Copy the plist file to LaunchAgents
```bash
cp /Users/manojkumark/Documents/BlockMate/com.blogapp.startup.plist ~/Library/LaunchAgents/
```

### Step 3: Load it with launchctl
```bash
launchctl load ~/Library/LaunchAgents/com.blogapp.startup.plist
```

### Step 4: Verify it's loaded
```bash
launchctl list | grep blogapp
```

You should see: `com.blogapp.startup`

### Step 5: Check the logs
```bash
tail -f /Users/manojkumark/Documents/BlockMate/startup.log
```

---

## To Unload/Stop Automatic Startup

If you want to disable automatic startup:
```bash
launchctl unload ~/Library/LaunchAgents/com.blogapp.startup.plist
```

---

## To Manually Start/Stop Services

### Stop backend:
```bash
pkill -f "node backend/server.js" || pkill -f "npm start"
```

### Stop MongoDB:
```bash
brew services stop mongodb-community
```

### View logs:
Backend logs:
```bash
tail -f /Users/manojkumark/Documents/BlockMate/backend.log
```

---

## What the Script Does

1. ✅ Starts MongoDB via Homebrew
2. ✅ Navigates to backend directory
3. ✅ Installs dependencies if needed
4. ✅ Starts the Node.js backend server (port 8000)
5. ✅ Creates logs for debugging

You'll still need to manually run `npm run dev` for the frontend (Vite), or modify this script to also start it if you prefer.
