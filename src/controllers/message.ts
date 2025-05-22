import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = (req as any).user?.id;

        console.log('Debug Info:', {
            currentUserId,
            targetUserId: userId,
            user: req.user
        });

        if (userId === currentUserId) {
            res.status(400).json({
                error: "Cannot fetch chat history with yourself"
            });
            return;
        }

        const otherUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!otherUser) {
            res.status(404).json({
                error: "User not found"
            })        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: currentUserId,
                        receiverId: userId
                    },
                    {
                        senderId: userId,
                        receiverId: currentUserId
                    }
                ]
            },
            orderBy: {
                timestamp: 'asc'
            },
            include: {
                sender: {
                    select: {
                        username: true
                    }
                }
            }
        });
        console.log('Found messages:', messages);
        res.json(messages);
    } catch (error) {
        console.error('Error in getChatHistory:', error);
        res.status(500).json({ error: "Failed to fetch chat history "});
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = (req as any).user.id
        
        const message = await prisma.message.create({
            data: {
                content,
                senderId,
                receiverId
            },
            include: {
                sender: {
                    select: {
                        username: true
                    }
                }
            }
        });
        
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: "Error sending message"})
    }
};

export const searchUsers = async ( req: Request, res: Response ) => {
    try {
        const { query } = req.query;
        const currentUserId = (req as any).user.id;

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        username: {
                            contains: query as string,
                            mode: 'insensitive'
                        }
                    },
                    {
                        id: {
                            not: currentUserId
                        }
                    }
                ]
            },
            select: {
                id: true,
                username: true
            }
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to search users" });
    }
}