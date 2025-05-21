import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import { setupSocket } from "./sockets/chat";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
    }
});

setupSocket(io);

const PORT = 5000;
server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});

