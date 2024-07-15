import React, { useEffect, useState } from 'react';

const Random = () => {
    let socket = new WebSocket('ws://localhost:8000/ws/game/');
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.onopen = () => {
            setMessage("WebSocket connection established");
            console.log("WebSocket connection established.");
            socket.send(JSON.stringify({ action: 'random' }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received:", data);
            if (data.action === 'start_game') {
                setMessage(`Game starting in room: ${data.room_id}`);
            } else if (data.message) {
                setMessage(data.message);
            }
        };

        socket.onclose = (event) => {
            setMessage("WebSocket connection closed");
            console.log("WebSocket connection closed:", event);
        };

        socket.onerror = (error) => {
            setMessage("WebSocket connection error");
            console.log("WebSocket error:", error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>{message || "Searching for a game..."}</h1>
        </div>
    );
}

export default Random;
