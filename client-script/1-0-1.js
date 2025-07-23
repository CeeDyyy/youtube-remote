// ==UserScript==
// @name         YouTube WebSocket Remote Control 1.0.1 - Only if visible
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Control YouTube from remote device via WebSocket
// @match        https://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Connect to your WebSocket server (change IP as needed)
    const ws = new WebSocket('wss://ytr-serv.maisonsoftware.app');
    ws.onopen = function() {
        console.log('[YouTubeRemote] WebSocket connected');
    };

    function handleMessage(event) {
        const cmd = event.data;
        console.log('[YouTubeRemote] Received cmd:', cmd);
        const video = document.querySelector('video');
        if (!video) return;
        if (cmd === 'forward') video.currentTime += 1;
        if (cmd === 'backward') video.currentTime -= 1;
        // Add more commands if needed
    };

    ws.addEventListener("message", handleMessage);
    // Listen to visibility change
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            ws.addEventListener("message", handleMessage);
        } else {
            ws.removeEventListener("message", handleMessage);
        }
    });
})();