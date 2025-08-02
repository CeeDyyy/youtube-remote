// ==UserScript==
// @name         YouTube WebSocket Remote Control 1.0.2 - Only if visible
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Control YouTube from remote device via WebSocket
// @match        https://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let ws = null;
    let hasPendingReconnect = false; // Flag For prevent listener stacking

    function handleMessage(event) {
        const cmd = event.data;
        console.log("[YouTubeRemote] Received cmd:", cmd);
        const video = document.querySelector('video');
        if (!video) return;
        if (cmd === 'forward') video.currentTime += 1;
        if (cmd === 'backward') video.currentTime -= 1;
        // Add more commands if needed
    };

    function connectWS() {
        // Prevent duplicate multiple WebSockets connections
        if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
            console.warn("[YouTubeRemote] Skipping connectWS — already connecting or open");
            return;
        }

        ws = new WebSocket('wss://ytr-serv.maisonsoftware.app');

        ws.onopen = () => {
            console.log("[YouTubeRemote] WebSocket connected");
            hasPendingReconnect = false;

            ws.onmessage = handleMessage;
        };

        ws.onclose = () => {
            console.log("[YouTubeRemote] WebSocket disconnected");

            if (document.visibilityState === 'visible') {
                console.log("[YouTubeRemote] Try to reconnect in 2 seconds...");
                setTimeout(connectWS, 2000);
            } else {
                console.log("[YouTubeRemote] Tab is hidden — Wait until tab is visible again before reconnecting");
                hasPendingReconnect = true;
            }
        };

        ws.onerror = (err) => {
            console.error("[YouTubeRemote] WebSocket error:", err);
            ws.close(); // ensure reconnect happens (triggers onclose → reconnect)
        };
    }

    document.addEventListener('visibilitychange', () => {
        if (!ws) return;

        if (document.visibilityState === 'visible') {
            console.log("[YouTubeRemote] Tab became visible");

            // Reconnect if one is pending
            if (hasPendingReconnect) {
                connectWS();
            }

            // Reattach message handler if connected
            if (ws.readyState === WebSocket.OPEN) {
                ws.onmessage = handleMessage;
            }
        } else {
            console.log("[YouTubeRemote] Tab became hidden");

            // Remove message handler while tab is hidden
            if (ws.readyState === WebSocket.OPEN) {
                ws.onmessage = null;
            }
        }
    });
    // Initial connection (only if tab is visible, for prevents unnecessary WebSocket creation when tab is hidden and improves performance, avoids bugs, and aligns with browser power-saving behavior)
    if (document.visibilityState === "visible") {
        console.log("[YouTubeRemote] Tab is visible — initial connection");
        connectWS();
    } else {
        console.log("[YouTubeRemote] Tab is hidden — deferring WebSocket connection");
    }
})();