var ws = new WebSocket('ws://localhost:8088');
ws.onopen = () => { ws.send('forward'); };