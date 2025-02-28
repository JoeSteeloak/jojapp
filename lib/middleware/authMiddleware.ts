import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (request: NextRequest) => {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return null;
        }

        // Dekryptera token och kasta om till rätt typ
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { userId: string };


        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};

