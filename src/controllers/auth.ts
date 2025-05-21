import {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({error: "Missing requried fields"});
        return;
}

    const existing = await prisma.user.findUnique({ where: {username}});

    if (existing) {
        res.status(400).json({ error : "Username already exists" });
        return;
    } 
        

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {username, password: hashed},
    });

    res.status(201).json({id: user.id, username: user.username });
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username }});
    if (!user) {
        res.status(404).json({ error: "User not found " });
        return;
    }  
        


    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d"});

    res.status(200).json({ token, user: { id: user.id, username: user.username }});
};