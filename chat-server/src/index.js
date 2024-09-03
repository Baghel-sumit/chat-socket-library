const WebSocket = require('ws');

class ChatServer {
    constructor(secretKey, accessKey) {
        this.secretKey = secretKey;
        this.accessKey = accessKey;
        this.rooms = {};
    }

    start(port) {
        this.wss = new WebSocket.Server({ port });

        this.wss.on('connection', (ws) => {
            ws.on('message', (data) => {
                const message = JSON.parse(data);
                this.handleMessage(ws, message);
            });

            ws.on('error', (err) => {
                console.error('WebSocket Error:', err);
            });
        });

        console.log(`Chat server running on port ${port}`);
    }

    handleMessage(ws, message) {
        const { type, payload, secretKey, accessKey } = message;

        if (secretKey !== this.secretKey || accessKey !== this.accessKey) {
            ws.send(JSON.stringify({ error: 'Invalid secret or access key' }));
            return;
        }

        if (type === 'join') {
            this.joinRoom(ws, payload.room);
        } else if (type === 'message') {
            this.sendMessageToRoom(payload.room, payload.message);
        }
    }

    joinRoom(ws, room) {
        if (!this.rooms[room]) {
            this.rooms[room] = [];
        }
        this.rooms[room].push(ws);
        ws.send(JSON.stringify({ success: `Joined room ${room}` }));
    }

    sendMessageToRoom(room, message) {
        if (this.rooms[room]) {
            this.rooms[room].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ room, message }));
                }
            });
        }
    }

    stop() {
        this.wss.close();
    }
}

module.exports = ChatServer;
