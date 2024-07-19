import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { SocketManager } from './socketManager.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const socketManager = new SocketManager(io);
socketManager.initialize();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});