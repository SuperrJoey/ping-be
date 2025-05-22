import express from "express";
import cors from "cors";
import authRoutes from "./routes/authroutes";
import messageRoutes from "./routes/messageRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

export default app;
