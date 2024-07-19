# Socket.IO Server with Node.js

This repository contains a simple Socket.IO server setup using Node.js. It demonstrates how to set up a real-time server with Socket.IO, handle common pitfalls like memory leaks and high concurrency, and connect from a web application.

## Project Structure

```
/socket-io-server
|-- server
|   |-- index.js
|   |-- socketManager.js
|-- public
|   |-- index.html
|-- package.json
```

## Getting Started

### Prerequisites

Ensure you have Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo-link-here/socket-io-server.git
   cd socket-io-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Server

To start the server, run:
```bash
npm start
```

For development with auto-reloading, use:
```bash
npm run dev
```

The server will run on port 3000 by default. You can change the port by setting the `PORT` environment variable.

### Project Files

#### `server/index.js`
The main entry point of the server, which sets up the Express app and initializes the Socket.IO server.

#### `server/socketManager.js`
Defines the `SocketManager` class responsible for managing Socket.IO connections, handling events, and ensuring proper cleanup to avoid memory leaks.

#### `public/index.html`
A simple HTML file to demonstrate connecting to the Socket.IO server from a web application.

#### `package.json`
Defines the project’s dependencies, scripts, and metadata.

## Example Code

### Server Code

#### `server/index.js`
```javascript
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
```

#### `server/socketManager.js`
```javascript
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
```

### Client Code

#### `public/index.html`
```html
<!DOCTYPE html>
<html>
<head>
    <title>Socket.IO Chat</title>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const socket = io();

            // Handle incoming chat messages
            socket.on('chat message', (msg) => {
                const item = document.createElement('li');
                item.textContent = msg;
                document.getElementById('messages').appendChild(item);
            });

            // Send chat message
            document.getElementById('form').addEventListener('submit', (e) => {
                e.preventDefault();
                const input = document.getElementById('input');
                socket.emit('chat message', input.value);
                input.value = '';
            });
        });
    </script>
</head>
<body>
    <ul id="messages"></ul>
    <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
    </form>
</body>
</html>
```

### `package.json`
```json
{
  "name": "socket-io-server",
  "version": "1.0.0",
  "description": "A simple Socket.IO server setup with Node.js",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "socket.io": "^4.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  },
  "author": "Your Name",
  "license": "MIT"
}
```

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Socket.IO](https://socket.io/)
- [Express](https://expressjs.com/)
