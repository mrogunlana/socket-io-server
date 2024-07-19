import { Transform } from 'stream';

export class SocketManager {
    constructor(io) {
        this.io = io;
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log(`A user connected: ${socket.id}`);

            // Handle disconnection and clean up resources to prevent memory leaks
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                this.cleanup(socket);
            });

            // Handle chat message event
            socket.on('chat message', (msg) => {
                this.io.emit('chat message', msg);
            });

            // Example for handling data streams efficiently
            socket.on('data', (data) => {
                this.handleDataStream(data, socket);
            });
        });
    }

    cleanup(socket) {
        // Implement resource cleanup here
        console.log(`Cleaning up resources for socket: ${socket.id}`);
        socket.removeAllListeners(); // Remove all event listeners for the socket
    }

    handleDataStream(data, socket) {
        const transformStream = new Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk);
                callback();
            }
        });

        data.pipe(transformStream).pipe(socket);
    }
}