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
   - Automatically reconnects to server if WebSocket is closed from idle/disconnected

2. **WebSocket Server** (Node.js):
   - Acts as a relay between the controller and the YouTube client
   - Stateless and lightweight

3. **Remote Controller Web App** (Next.js):
   - Can be opened on wearable device browsers
   - Sends commands via WebSocket based on scroll or button input
   - Designed for quick access and minimal interaction
   - Displays current time
   - Also supports automatically reconnects when socket closes or becomes idle

### 🖥️ Architecture

```text
[ Wearable Controller (Next.js Web App) ]
               ↓
       [ WebSocket Server (Node.js) ]
               ↓
[ YouTube Page (Tampermonkey Client Script) ]
```

## ✨ Features

* ⏪ Rewind and ⏩ forward by 1 second

* ▶️ Pause / Play toggle

* 🔇 Mute toggle

* 🕓 Clock display on controller

* 🔁 Real-time communication via WebSocket

* 🔄 Scroll gesture-based control (for devices with rotating input)

* 🔌 Automatic WebSocket reconnection on disconnection on both controller and client

* 🔋 Energy-efficient player: background is true black and the player can be hidden instead of reloaded for faster response and better battery life (especially on AMOLED displays).

---

## 📦 Versions

| Version    | Description                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| **v1.0** | Initial usable release with scroll-based remote control<br>🔧 Fix: Prevents parallel (duplicate) connections from iframes                                                                                                                |
| **v1.0.1** | Added auto-reconnect (2s delay) on WebSocket in both client and controller                                   |
| **v1.0.2** | Optimized: Only triggers when YouTube tab is visible                                                         |
| **v1.0.3** | Optimized: Replaced "only if visible" with **last active YouTube page** logic (if multiple YouTube tabs are open, only the most recently active one is controlled)<br>🗂️ Uses `localStorage` to keep track of the current owner tab                                                         |
| **v1.1** | Added new additional controls: play/pause, mute; clock display; partial playback mirror sync prototype (WIP)<br>### Recent Update<br>- Reorganized UI for easier use. |
| **v1.2** | ✅ Full playback mirror/sync (a.k.a. *Request Video*): the controller can request the YouTube client’s video + params and play it on the remote device, with time sync and forward/backward support<br>### Recent Update<br>- Optimized power efficiency and performance on AMOLED devices. Added instant hide/show functionality instead of removing and reloading video.<br>- Improved battery efficiency and usability (true black background, new hide/show control, layout refinements). |

## 🧪 Notes

* Currently tested on **Samsung Galaxy Watch6 Classic** (via built-in browser with rotating bezel)

* Concept and design optimized for wearables, but works on desktop/mobile too

* ~~YouTube playback mirror/sync is **experimental and not finalized**~~

* From **v1.0.3 onward**, controls target the **last active YouTube page** instead of only working when the tab is visible  
  - Uses `localStorage` to record the active YouTube page (the "owner")

* From **v1.2 onward**, the controller can mirror YouTube playback (video, time sync, seeking)

* Requires Tampermonkey extension to inject script into YouTube page

* WebSocket communication is open (no authentication) — should be secured if used publicly

* Prevents Tampermonkey script from running Parallel/duplicate WebSocket connections (from iframes)

* **Technical Improvements** Improved performance and code structure (moved from inline styles to `className`-based styling) for faster rendering. *(This change applies retroactively to all previous versions.)*

## Deployment Options

This project can be deployed in two ways.

### 1. Unified Server (Recommended for Personal Use)

Runs the Next.js frontend and WebSocket relay in a single Node.js process.

Steps:

```bash
cd nextjs
npm install
npm run build

cd ..
npm install
npm run dev:unified or node unified-server.js
```

Server will run on: http://localhost:3000

To expose it securely to other devices, you can use Cloudflare Tunnel:
```bash
cloudflared tunnel --url http://localhost:3000
```
or
```cmd
.\cloudflared-windows-amd64.exe tunnel --url http://localhost:3000
```
This automatically provides:

https://&lt;random&gt;.trycloudflare.com

wss://&lt;random&gt;.trycloudflare.com/ws

### 2. Docker Deployment

Docker configuration remains available for containerized environments.

```bash
npm run docker
```

Stop containers:

```bash
npm run docker:stop
```

---

## 🚧 To-Do
* Improve input UX for more wearables

* ~~Implement full visual sync/mirror with YouTube playback~~

* Add settings UI (e.g. adjust step time, toggle commands)

* Add security/authentication layer for public server use

---

## ⚠️ Disclaimer

This project is for **personal, educational, and prototyping purposes**. It relies on Tampermonkey to inject scripts into YouTube to modifies its client-side, which may break if YouTube changes its internal structure. Use responsibly.

---

## 📃 License

[MIT License](LICENSE)

---

## 📜 Changelog

See the full development history in the [CHANGELOG.md](./CHANGELOG.md).
