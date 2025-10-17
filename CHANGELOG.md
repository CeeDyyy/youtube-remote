---

# 📜 CHANGELOG

All notable changes to this project will be documented here.
The format follows **Phases + Days** (like a dev journal), alongside semantic **versions**.

---

## 🟢 Phase 1 – Initial Development (Day 1–4)

* **Day 1 (v1.0.0)**

  * Proof of concept: control YouTube playback externally via Tampermonkey + WebSocket.
  * Basic scroll-to-seek (±1 second).
  * Prevented parallel/duplicate WebSocket connections with:

    ```js
    if (window.top !== window.self) return;
    ```
* **Day 2 (v1.0.1)**

  * Added a simple Web App as controller (buttons, no scroll yet).
  * Implemented auto-reconnect (2s after close) for both client & controller.
* **Day 2 Night (v1.0.2)**

  * Controller Web App detects scroll → sends seek command.
  * Added “Only if visible” restriction (script only runs on visible tab).
* **Day 3**

  * Deployed server → works online (no need for local run).
* **Day 4 (v1.1.0)**

  * Added more controls: play/pause, mute, clock display.
  * Prototype “YouTube playback mirror” (unfinished).

---

## 🟡 Phase 2 – After Break (Day 1+)

* **Day 1 (v1.0.3)**

  * Switched from “Only if visible” → **Last Active Tab** system.
  * Uses `localStorage` to store current “owner” YouTube page.
  * Behavior: if multiple YouTube tabs are open, only the last active tab responds to controls.

* **Day 2 (v1.2)**

  * ✅ Playback Mirror/Sync completed (*Request Video*).
  * Controller can now request:

    * Video ID + playback params from client.
    * Remote playback on Galaxy Watch with synced time.
    * Forward/backward seeking applied across devices.

* **Day 3 (v1.2)** (Which take just a few minutes to do) 

  * Added version info in each log message (controller, client, and server).  
  * Helps identify which version each component is running for easier debugging and compatibility tracking.

* **Day 3 (v1.2 — Instant Visibility Toggle and Display Power Optimization)** (This take less than hour to make) 

  * Changed background color of the video player (when no video is loaded) from `bg-gray-800` (#1F2937) to `bg-black` (#000000) to save an additional small amount of battery on AMOLED displays (e.g. Samsung Galaxy Watch 6 Classic).
  * Replaced the mute/unmute button with a hide/show button:

    * `Hide` instantly sets `visibility: hidden` and pauses the video (for battery saving) instead of removing the player.
    * `Show` restores `visibility: visible` and resumes playback without reloading the video.
    * This approach reduces battery and improves responsiveness avoids the delay caused by removing and re-requesting to reloading the video.

---

## 🔮 Planned

* [ ] Improve multi-tab handling beyond single “owner” tab.
* [ ] Optimize playback mirror (reduce latency).
* [ ] UI/UX improvements for controller Web App.
* [ ] Explore authentication for multi-user usage.

---

⚠️ **Note:** Version numbers follow feature-completion, not strict Day count.
Phases reflect development cycles separated by breaks.

---