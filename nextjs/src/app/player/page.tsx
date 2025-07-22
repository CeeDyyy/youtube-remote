'use client'

import { useEffect, useRef, useState } from 'react';
import Display from '../../components/display';

export default function Home() {
    const ws = useRef(null);

    // Replace with your PC's LAN address!
    const serverUrl = "wss://ytr-serv.maisonsoftware.app";

    useEffect(() => {
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

    const [isPause, setIsPause] = useState(false);
    const [isMute, setIsMute] = useState(false);

    return (
        <div style={styles.page}>
            <div style={styles.spacer} />
            <Display />
            <div style={{ ...styles.counter, bottom: '5%', width: '50%', display: 'flex', justifyContent: 'space-between' }}>
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
                <div style={{ ...styles.counter }}>-{upCount}</div>
            )}
            {downCount > 0 && (
                <div style={{ ...styles.counter }}>+{downCount}</div>
            )}
        </div>
    );
}

const styles = {
    page: {
        height: '200000px',
        backgroundColor: '#000',
        fontFamily: 'monospace',
        position: 'relative' as const,
    },
    spacer: {
        height: '200000px',
    },
    counter: {
        position: 'fixed' as const,
        bottom: '5%',  // top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem', // fontSize: '4rem',
        zIndex: 999,
        transition: 'opacity 0.2s',
        color: 'white',
    },
};
