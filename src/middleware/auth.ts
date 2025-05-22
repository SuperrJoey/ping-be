import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

declare global {
    namespace Express {
        interface Request {
            user?:{
                id: string;
            }
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction ) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "Access denied, no token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        req.user = decoded;
        next(); 
    } catch (error) {
        res.status(403).json({error: "Invalid token" });
        return;
    }
}