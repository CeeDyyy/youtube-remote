// ==UserScript==
// @name         YouTube WebSocket Remote Control 1.0.3 - Last Active Tab
// @namespace    http://tampermonkey.net/
// @version      1.0.3
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
            original.call(console, "[YouTubeRemote_v1.0.3]", ...args, `[${timestamp}]`);
        };
    }

    if (window.top !== window.self) return; // 🔒 Prevent parallel connects (the unwanted/second connection that's appear around 40-50 second later)

    let ws = null;
    const TAB_ID = Date.now() + "_" + Math.random().toString(36).slice(2);
    let isOwner = false; // local state
    const OWNERSHIP_KEY = "YT_REMOTE_OWNER"; // Ownership is coordinated using localStorage

    function handleMessage(event) {
        const cmd = event.data;
        console.log("Received cmd:", cmd);
        const video = document.querySelector('video');
        if (!video) return;
        if (cmd === 'forward') video.currentTime += 1;
        if (cmd === 'backward') video.currentTime -= 1;
        // Add more commands if needed
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

            ws.onmessage = handleMessage;
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");

            if (isOwner) {
                // Only reconnect if still owner
                console.log("Try to reconnect in 2 seconds...");
                setTimeout(connectWS, 2000);
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            ws.close(); // ensure reconnect happens (triggers onclose → reconnect)
        };
    }

    function disconnectWS() {
        if (ws) {
            console.log("Closing WebSocket (lost ownership)");
            ws.onmessage = null;
            ws.close();
            ws = null;
        }
    }

    // ------------------ Owner Claiming ------------------
    function claimOwner() {
        // Only claim if this tab is active (focused & visible)
        if (document.visibilityState === "visible" && document.hasFocus()) {
            // Overwrite ownership
            localStorage.setItem(OWNERSHIP_KEY, TAB_ID);

            if (!isOwner) {
                isOwner = true;
                console.log("Claimed ownership (active tab)");
                connectWS();
            }
        }
    }

    // ------------------ Event Listeners ------------------

    // Tab gains visibility ('visibilitychange' is not strictly necessary if 'focus' and 'load' are already handled. Its main purpose is robustness in edge cases where a tab gains visibility but 'focus' does not fire.)
    document.addEventListener('visibilitychange', claimOwner);

    // Handle focus events (when user clicks into this tab)
    window.addEventListener('focus', claimOwner);

    // Listen for ownership changes in localStorage (from other tabs)
    window.addEventListener('storage', (e) => {
        if (e.key === OWNERSHIP_KEY) {
            // If someone else took owner, disconnect
            const currentOwner = localStorage.getItem(OWNERSHIP_KEY);
            if (currentOwner !== TAB_ID && isOwner) {
                console.log("Lost ownership to another tab");
                isOwner = false;
                disconnectWS();
            }
        }
    });

    // Safety: if this tab is closed and is owner, release ownership
    // Not a strict requirement, it’s basically a clean-up / courtesy step for fail-safe. It reduces confusion by making the storage state reflect reality (no ghost owner). Without it, everything still works.
    window.addEventListener('beforeunload', () => {
        if (isOwner && localStorage.getItem(OWNERSHIP_KEY) === TAB_ID) {
            localStorage.removeItem(OWNERSHIP_KEY);
        }
    });

    // Page load (new tab / refresh)
    window.addEventListener('load', claimOwner);
})();