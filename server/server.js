import http from 'http';
import { Server as SocketServer } from 'socket.io';
import connectDatabase from './src/config/database.js';
import app from './src/app.js';
import { corsConfig } from './src/config/cors.js';

// Load env vars
import dotenv from 'dotenv';
dotenv.config();

const server = http.createServer(app);

// Socket.io Setup
const io = new SocketServer(server, { // Use default cors options for development
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Initialize DB
connectDatabase();

// Socket Connection handling
io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`UNHANDLED REJECTION! 💥 Shutting down...`);
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
