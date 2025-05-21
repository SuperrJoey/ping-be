import { timeStamp } from "console";
import { Server, Socket } from "socket.io";

interface JoinRoomPayload {
    roomId: string;
    userId: string;
}

export const setupSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("New Client connected:", socket.id);

        socket.on("joinRoom", ({ roomId, userId}: JoinRoomPayload) => {
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
        });

        socket.on("sendMessage", ({ roomId, message, userId }) => {
            const payload = {
                roomId, 
                userId,
                message,
                timestamp: new Date().toISOString(), 
            };

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
                    })
        })
    })
}