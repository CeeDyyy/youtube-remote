// ==UserScript==
// @name         YouTube WebSocket Remote Control 1.0.1 - Connection close on idle handling
// @namespace    http://tampermonkey.net/
// @version      1.0.1
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
      original.call(console, ...args, `[${timestamp}]`);
    };
  }

  function connectWS() {
    // Connect to your WebSocket server (change IP as needed)
    const ws = new WebSocket('wss://ytr-serv.maisonsoftware.app');
    ws.onopen = () => {
      console.log("[YouTubeRemote] WebSocket connected");
    };

    ws.onmessage = function (event) {
      const cmd = event.data;
      console.log("[YouTubeRemote] Received cmd:", cmd);
      const video = document.querySelector('video');
      if (!video) return;
      if (cmd === 'forward') video.currentTime += 1;
      if (cmd === 'backward') video.currentTime -= 1;
      // Add more commands if needed
    };

    ws.onclose = () => {
      console.log("[YouTubeRemote] WebSocket disconnected, Try to reconnect in 2 seconds...");
      setTimeout(connectWS, 2000);
    };

  }
  connectWS();
})();