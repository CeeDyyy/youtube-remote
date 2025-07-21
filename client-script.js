// ==UserScript==
// @name         YouTube WebSocket Remote Control
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Control YouTube from remote device via WebSocket
// @match        https://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Connect to your WebSocket server (change IP as needed)
  const ws = new WebSocket('ws://localhost:8088');
  ws.onopen = function() {
    console.log('[YouTubeRemote] WebSocket connected');
  };

  ws.onmessage = function(event) {
    const cmd = event.data;
    console.log('[YouTubeRemote] Received cmd:', cmd);
    const video = document.querySelector('video');
    if (!video) return;
    if (cmd === 'forward') video.currentTime += 1;
    if (cmd === 'backward') video.currentTime -= 1;
    // Add more commands if needed
  };
})();