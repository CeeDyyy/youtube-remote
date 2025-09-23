// ==UserScript==
// @name         YouTube WebSocket Remote Control 1.1 - More Controls
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Control YouTube from remote device via WebSocket
// @match        https://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const consoleMethods = ['log', 'info', 'warn', 'error', 'debug'];
    for (const method of consoleMethods) {
        const original = console[method];
        console[method] = (...args) => {
            const timestamp = new Date().toISOString();
            original.call(console, "[YouTubeRemote]", ...args, `[${timestamp}]`);
        };
    }

    if (window.top !== window.self) return; // 🔒 Prevent parallel connects (the unwanted/second connection that's appear around 40-50 second later)

    let ws = null;
    let hasPendingReconnect = false; // Flag For prevent listener stacking

    function handleMessage(event) {
        const cmd = event.data;
        console.log("Received cmd:", cmd);
        const video = document.querySelector('video');
        if (!video) return;
        if (cmd === 'forward') video.currentTime += 1;
        if (cmd === 'backward') video.currentTime -= 1;
        // Add more commands if needed
        if (cmd === 'pause') video.pause();
        if (cmd === 'play') video.play();
        if (cmd === 'mute') video.muted = true;
        if (cmd === 'unmute') video.muted = false;
        if (cmd === 'toggle-mute') video.muted = !video.muted;
    };

    function connectWS() {
        // Prevent duplicate multiple WebSockets connections
        if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
            console.warn("Skipping connectWS — already connecting or open");
            return;
        }

        ws = new WebSocket('wss://ytr-serv.maisonsoftware.app');

        ws.onopen = () => {
            console.log("WebSocket connected");
            hasPendingReconnect = false;

            ws.onmessage = handleMessage;
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");

            if (document.visibilityState === 'visible') {
                console.log("Try to reconnect in 2 seconds...");
                setTimeout(connectWS, 2000);
            } else {
                console.log("Tab is hidden — Wait until tab is visible again before reconnecting");
                hasPendingReconnect = true;
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            ws.close(); // ensure reconnect happens (triggers onclose → reconnect)
        };
    }

    document.addEventListener('visibilitychange', () => {
        if (!ws) return;

        if (document.visibilityState === 'visible') {
            console.log("Tab became visible");

            // Reconnect if one is pending
            if (hasPendingReconnect) {
                connectWS();
            }

            // Reattach message handler if connected
            if (ws.readyState === WebSocket.OPEN) {
                ws.onmessage = handleMessage;
            }
        } else {
            console.log("Tab became hidden");

            // Remove message handler while tab is hidden
            if (ws.readyState === WebSocket.OPEN) {
                ws.onmessage = null;
            }
        }
    });
    // Initial connection (only if tab is visible, for prevents unnecessary WebSocket creation when tab is hidden and improves performance, avoids bugs, and aligns with browser power-saving behavior)
    if (document.visibilityState === "visible") {
        console.log("Tab is visible — initial connection");
        connectWS();
    } else {
        console.log("Tab is hidden — deferring WebSocket connection");
    }
})();