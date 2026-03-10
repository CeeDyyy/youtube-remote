---

# 📜 CHANGELOG

All notable changes to this project will be documented here.
The format follows **Phases + Days** (like a dev journal), alongside semantic **versions**.

---

## 🟢 Phase 1 – Initial Development (Day 1–4)

* **Day 1**
  #### v1.0

  * Proof of concept: control YouTube playback externally via Tampermonkey + WebSocket.
  * Basic scroll-to-seek (±1 second).
  * Prevented parallel/duplicate WebSocket connections with:

    ```js
    if (window.top !== window.self) return;
    ```
* **Day 2**
  #### v1.0.1

  * Added a simple Web App as controller (buttons, no scroll yet).
  * Implemented auto-reconnect (2s after close) for both client & controller.
* **Day 2 Night**
  #### v1.0.2

  * Controller Web App detects scroll → sends seek command.
  * Added “Only if visible” restriction (script only runs on visible tab).
* **Day 3**

  * Deployed server → works online (no need for local run).
* **Day 4**
  #### v1.1

  * Added more controls: play/pause, mute, clock display.
  * Prototype “YouTube playback mirror” (unfinished).

---

## 🟡 Phase 2 – After Break (Day 1+)

* **Day 1**
  #### v1.0.3

  * Switched from “Only if visible” → **Last Active Tab** system.
  * Uses `localStorage` to store current “owner” YouTube page.
  * Behavior: if multiple YouTube tabs are open, only the last active tab responds to controls.

* **Day 2**
  #### v1.2

  * ✅ Playback Mirror/Sync completed (*Request Video*).
  * Controller can now request:

    * Video ID + playback params from client.
    * Remote playback on Galaxy Watch with synced time.
    * Forward/backward seeking applied across devices.

* **Day 3**
  #### v1.2 *(Which take just a few minutes to do)* 

  * Added version info in each log message (controller, client, and server).  
  * Helps identify which version each component is running for easier debugging and compatibility tracking.

* **Day 3**
  #### v1.2 — Instant Visibility Toggle and Display Power Optimization *(This takes less than an hour to make)* 

  * Changed background color of the video player (when no video is loaded) from `bg-gray-800` (#1F2937) to `bg-black` (#000000 or true black) to reduce power usage for save an additional small amount of battery on AMOLED displays (e.g. Samsung Galaxy Watch 6 Classic).
  * Replaced the mute/unmute button with a hide/show button:

    * `Hide` instantly sets `visibility: hidden` and pauses the video (for battery saving) instead of removing the player.
    * `Show` restores `visibility: visible` and resumes playback without reloading the video.
    * This approach reduces battery and improves responsiveness avoids the delay caused by removing and re-requesting to reloading the video.

* **Day 4**
  #### v1.1 — UI Layout Improvements
  * Re-adjusted and rearranged control element positions for better usability and accessibility.
  * Minor interface refinements for more intuitive operation.

  #### v1.2 — Display Power Optimization and UI Adjustments
  * Brought back the mute/unmute button when there is **no requested video** (so users can still control playback state before loading).
  * Adjusted element layout again for better usability with the new hide/show control.

  #### Applies retroactively to all previous versions
  * Replaced inline `style` attributes with `className` usage across all components and all versions for cleaner DOM — reduces layout recalculations — Improves rendering efficiency — better performance, consistency, and maintainability.

* **Day 5**
  ### Infrastructure Refactor — Unified Server (All Versions)

  A lightweight deployment option was introduced that removes the need to run
  separate containers for the WebSocket server and the Next.js frontend.

  #### Changes
  * Added `unified-server.js` in the project root.
  * The unified server runs:
    * Next.js application
    * WebSocket relay server
    in a single Node.js process.
  * WebSocket upgrade handled at `/ws`.
  * All messages are broadcast to connected clients.

  #### Benefits
  * No Docker required for simple deployments.
  * Lower memory and CPU overhead on small home servers.
  * Simplified setup for local networks and personal use.

  #### WebSocket Client Improvements
  * WebSocket URL now derived dynamically from `window.location`.
  * Added environment variable support:
    * `NEXT_PUBLIC_WS_URL`
  * Prevented server-side rendering errors (`location is not defined`)
    by moving WebSocket initialization into a client-only lifecycle.

  #### Deployment Compatibility
  * Still compatible with existing Docker setup.
  * Supports Cloudflare Tunnel for HTTPS/WSS access.

  #### New Deployment Option

  Run the entire system without containers: `node unified-server.js`
  
  This serves:
  * Next.js frontend
  * WebSocket relay
  * Both on port `3000`

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