'use client'

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const ws = useRef(null);

  const [serverUrl, setServerUrl] = useState<string | null>(null);
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    // Replace with your PC's LAN address!
    const url = process.env.NEXT_PUBLIC_WS_URL || `${protocol}://${window.location.host}/ws`; // Fallback to current host if env variable is not set

    setServerUrl(url);
  }, []);

  useEffect(() => {
    if (!serverUrl) return;

    ws.current = new WebSocket(serverUrl);

    return () => {
      ws.current?.close();
    };
  }, [serverUrl]);

  function send(msg: string) {
    ws.current?.send(msg);
  }

  const scrollMid = 100000;
  const scrollStep = 10; // Sensitivity: how much scroll counts as one tick
  const [upCount, setUpCount] = useState(0);
  const [downCount, setDownCount] = useState(0);

  const upTimerRef = useRef<NodeJS.Timeout | null>(null);
  const downTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function A (scroll up)
  const onScrollUp = () => {
    console.log('Function A: Scroll Up');
    setUpCount(prev => prev + 1);
    send("backward");
    if (upTimerRef.current) clearTimeout(upTimerRef.current);
    upTimerRef.current = setTimeout(() => setUpCount(0), 800); // Hide after 800ms
  };

  // Function B (scroll down)
  const onScrollDown = () => {
    console.log('Function B: Scroll Down');
    setDownCount(prev => prev + 1);
    send("forward");
    if (downTimerRef.current) clearTimeout(downTimerRef.current);
    downTimerRef.current = setTimeout(() => setDownCount(0), 800); // Hide after 800ms
  };

  useEffect(() => {
    window.scrollTo(0, scrollMid);

    const handleScroll = () => {
      const delta = window.scrollY - scrollMid;

      if (delta <= -scrollStep) {
        onScrollUp();
      } else if (delta >= scrollStep) {
        onScrollDown();
      }

      window.scrollTo(0, scrollMid); // Reset scroll position
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (serverUrl) return (   // If there is serverUrl, it means it's client side, because serverUrl is set in useEffect which only runs on client side.
    <div className="page">
      <div className="spacer" />
      {upCount > 0 && (
        <div className="counter text-[#f44]">-{upCount}</div>
      )}
      {downCount > 0 && (
        <div className="counter text-[#4f4]">+{downCount}</div>
      )}
    </div>
  );
}
