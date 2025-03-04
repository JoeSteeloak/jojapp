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

        if (!username || !email || !password) {
            return new NextResponse(
                JSON.stringify({ message: "Username, email, and password are required" }),
                { status: 400 }
            );
        }

        await connect();

        // Kontrollera om användaren redan finns
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? "email" : "username";
            return new NextResponse(
                JSON.stringify({ message: `${field} is already taken` }),
                { status: 400 }
            );
        }

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

        await connect();

        const body = await request.json();
        const { userId, newUsername, oldPassword, newPassword } = body;

        if (!userId || !newUsername || !oldPassword) {
            return new NextResponse(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user id" }),
                { status: 400 }
            );
        }

        // Hämta användaren från databasen
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        // Kontrollera att lösenordet är korrekt
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return new NextResponse(
                JSON.stringify({ message: "Incorrect old password" }),
                { status: 401 }
            );
        }

        // Kolla om användarnamnet är upptaget
        if (newUsername !== user.username) {
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return new NextResponse(
                    JSON.stringify({ message: "Username is already taken" }),
                    { status: 400 }
                );
            }
        }

        // Om `newPassword` anges, hash det innan uppdatering
        let updatedPassword = user.password;
        if (newPassword) {
            updatedPassword = await bcrypt.hash(newPassword, 10);
        }

        // Uppdatera användaren
        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername, password: updatedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "Failed to update user" }),
                { status: 500 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User updated successfully", user: updatedUser }),
            { status: 200 }
        );

    } catch (error: any) {
        return new NextResponse("Error in updating user: " + error.message, { status: 500 });
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

        const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

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
        return new NextResponse("Error in deleting user: " + error.message, { status: 500 });
    }
};
