import connect from "@/lib/db";
import User from "@/lib/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try {
        const { email, password } = await request.json();

        await connect();
        const user = await User.findOne({ email });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new NextResponse(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
        }

        // Skapa JWT-token
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        return new NextResponse(JSON.stringify({ token, userId: user._id }), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error in login: " + error.message, { status: 500 });
    }
};
