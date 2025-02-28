import connect from "@/lib/db";
import { verifyToken } from "@/lib/middleware/authMiddleware";
import User from "@/lib/models/users";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

// Get user (Protected)
export const GET = async (request: NextRequest) => {
    try {
        await connect();

        const decoded = verifyToken(request);
        if (!decoded) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const user = await User.findById(decoded.userId).select("-password"); // Exkludera lösenordet från svaret
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify(user), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error fetching user data: " + error.message, { status: 500 });
    }
};


// Create new user
export const POST = async (request: Request) => {
    try {
        const { username, email, password } = await request.json(); 

        if (!username || !email || !password) { //Kontrollera att email finns
            return new NextResponse("Username, email, and password are required", { status: 400 });
        }

        await connect();

        // Hasha lösenord
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword }); 

        await newUser.save();
        return new NextResponse(JSON.stringify({ message: "User created" }), { status: 201 });

    } catch (error: any) {
        return new NextResponse("Error in creating user: " + error.message, { status: 500 });
    }
};


// Update user (Protected)
export const PATCH = async (request: NextRequest) => {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const body = await request.json();
        const { userId, newUsername } = body;

        await connect();
        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({ message: "ID or new username not found" }),
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user id" }),
                { status: 400 }
            );
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User is not found" }),
                { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is updated", user: updatedUser }),
            { status: 200 }
        );

    } catch (error: any) {
        return new NextResponse("Error in updating user: " + error.message, {
            status: 500
        });
    }
};

// Delete user (Protected)
export const DELETE = async (request: NextRequest) => {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Id not found" }),
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user id" }),
                { status: 400 }
            );
        }

        await connect();

        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User is not found in database" }),
                { status: 400 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User is deleted", user: deletedUser }),
            { status: 200 }
        );
    } catch (error: any) {
        return new NextResponse("Error in deleting user: " + error.message, {
            status: 500
        });
    }
};