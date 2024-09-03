import WebSocket from 'websocket';

class ChatClient {
    constructor(secretKey, accessKey) {
        this.secretKey = secretKey;
        this.accessKey = accessKey;
        this.socket = null;
    }

    connect(serverUrl) {
        this.socket = new WebSocket(serverUrl);

        this.socket.onopen = () => {
            console.log('Connected to chat server');
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Message from server:', message);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        this.socket.onclose = () => {
            console.log('Disconnected from chat server');
        };
    }

    joinRoom(room) {
        const joinMessage = JSON.stringify({
            type: 'join',
            secretKey: this.secretKey,
            accessKey: this.accessKey,
            payload: { room },
        });
        this.socket.send(joinMessage);
    }

    sendMessage(room, message) {
        const chatMessage = JSON.stringify({
            type: 'message',
            secretKey: this.secretKey,
            accessKey: this.accessKey,
            payload: { room, message },
        });
        this.socket.send(chatMessage);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default ChatClient;
