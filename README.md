# youtube-remote
# YouTube Playback Remote via Scroll

A custom controller to precisely rewind or fast-forward YouTube videos using 1-second steps — optimized for wearable devices like the Galaxy Watch6 Classic.

## 🚩 Problem

YouTube's default rewind/forward feature (5 seconds per tap) is often too coarse for catching small audio or visual details. It's especially inconvenient when you're not near your device or can't use a touchscreen.

## 🎯 Solution

This project provides a way to:
- Rewind/forward a YouTube video in **1-second increments**
- Use **scroll gestures** on a web browser (e.g., Galaxy Watch's rotating bezel) as remote input
- Control YouTube playback **without touching the main screen**

## 🛠️ How It Works

The system has three components:

1. **YouTube Client Script** (Tampermonkey):
   - Injected into the YouTube page
   - Listens for commands over WebSocket
   - Executes playback control (rewind, forward, play/pause, mute, etc.)

2. **WebSocket Server** (Node.js):
   - Acts as a relay between the controller and the YouTube client
   - Stateless and lightweight

3. **Remote Controller Web App** (Next.js):
   - Can be opened on wearable device browsers
   - Sends commands via WebSocket based on scroll or button input
   - Designed for quick access and minimal interaction

## 🖥️ Architecture

```text
[ Wearable Controller (Next.js Web App) ]
               ↓
       [ WebSocket Server (Node.js) ]
               ↓
[ YouTube Page (Tampermonkey Script) ]
```

## ✨ Features
⏪ Rewind and ⏩ forward by 1 second

▶️ Pause / Play toggle

🔇 Mute toggle

🕓 Clock display on controller

🔁 Real-time communication via WebSocket

🔄 Scroll gesture-based control (for devices with rotating input)

## 📦 Versions
Version	Features
v1.0.0	Initial usable release with scroll control
v1.0.1	Optimized: Only triggers when YouTube tab is visible
v1.1.0	Additional commands: play/pause, mute; basic clock; partial sync prototype (WIP)

## 🧪 Notes
Currently tested on Samsung Galaxy Watch6 Classic (via built-in browser with rotating bezel)

Concept and design optimized for wearables, but works on desktop/mobile too

YouTube playback mirror/sync is experimental and not finalized

## 🚧 To-Do
Implement full visual sync/mirror with YouTube playback

Optimize input UX for more wearables

Add security/authentication layer for public server use

## ⚠️ Disclaimer
This project is for personal, educational, and prototyping purposes. It relies on Tampermonkey to inject scripts into YouTube, which may break if YouTube changes its internal APIs. Use responsibly.