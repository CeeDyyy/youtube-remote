'use client'

import { useEffect, useRef, useState } from 'react';
import Clock from '../../components/clock';

export default function Home() {
    const [waitForClientSide, setWaitForClientSide] = useState(false);
    useEffect(() => { setWaitForClientSide(true); }, []);

    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
    const [connected, setConnected] = useState(false);
    const [statusMsg, setStatusMsg] = useState("Disconnected");

    // Replace with your PC's LAN address!
    const serverUrl = "wss://ytr-serv.maisonsoftware.app";

    function setupWebSocket() {
        setStatusMsg("Connecting...");
        console.log(`[YouTubeRemote_v1.1] Connecting... [${new Date().toISOString()}]`);
        const socket = new WebSocket(serverUrl);

        socket.onopen = () => {
            setConnected(true);
            setStatusMsg("Connected");
            console.log(`[YouTubeRemote_v1.1] Connected [${new Date().toISOString()}]`);
            // You can notify server or sync on open if needed
        };

        socket.onclose = () => {
            setConnected(false);
            setStatusMsg("Disconnected. Reconnecting...");
            console.log(`[YouTubeRemote_v1.1] Disconnected. Reconnecting... [${new Date().toISOString()}]`);
            // Reconnect after delay, unless already scheduled
            if (!reconnectTimeout.current) {
                reconnectTimeout.current = setTimeout(() => {
                    setupWebSocket();
                    reconnectTimeout.current = null;
                }, 2000); // 2 seconds
            }
        };

        socket.onerror = (err) => {
            setStatusMsg("Connection error. Reconnecting...");
            console.log(`[YouTubeRemote_v1.1] Connection error. Reconnecting... [${new Date().toISOString()}]`);
            socket.close();
        };

        ws.current = socket;
    }

    useEffect(() => {
        setupWebSocket();
        return () => {
            ws.current?.close();
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        };
        // eslint-disable-next-line
    }, []);

    function send(msg: any) {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(typeof msg === "string" ? msg : JSON.stringify(msg));
        } else {
            setStatusMsg("Not connected!");
            console.log(`[YouTubeRemote_v1.1] Not connected! [${new Date().toISOString()}]`);
        }
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

    const [isPause, setIsPause] = useState(false);
    const [isMute, setIsMute] = useState(false);

    if (waitForClientSide) return (
        <div className="page">
            <div className="spacer" />
            <div className="counter clock-big">
                <Clock />
            </div>
            <div className="counter action-big">
                <button
                    onClick={() => isPause ?
                        (
                            send("play"),
                            setIsPause(false)
                        ) : (
                            send("pause"),
                            setIsPause(true)
                        )
                    }
                >
                    {isPause ? "▶️" : "⏸"}
                </button>
                <button
                    onClick={() => isMute ?
                        (
                            send("unmute"),
                            setIsMute(false)
                        ) : (
                            send("mute"),
                            setIsMute(true)
                        )
                    }
                >
                    {isMute ? "🔊" : "🔇"}
                </button>
            </div>
            {upCount > 0 && (
                <div className="counter text-[#f44]">-{upCount}</div>
            )}
            {downCount > 0 && (
                <div className="counter text-[#4f4]">+{downCount}</div>
            )}
            <div className="counter status">
                <span className={connected ? "text-[#008000]" : "text-[#ff0000]"}>
                    {statusMsg}
                </span>
            </div>
        </div>
    );
}
