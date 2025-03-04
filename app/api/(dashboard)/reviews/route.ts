import connect from "@/lib/db";
import User from "@/lib/models/users";
import Review from "@/lib/models/reviews";
import { Types } from "mongoose";
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";

// GET Reviews (All or By User or by BookId)
export const GET = async (request: NextRequest) => {
    try {
        await connect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const bookId = searchParams.get("bookId"); // Hämta bookId från query-param

        // Om vi söker på en specifik bok
        if (bookId) {
            const reviews = await Review.find({ bookId });
            return new NextResponse(JSON.stringify(reviews), { status: 200 });
        }

        // Om vi söker på en specifik användare
        if (userId) {
            if (!Types.ObjectId.isValid(userId)) {
                return new NextResponse(
                    JSON.stringify({ message: "Invalid or missing user id" }),
                    { status: 400 }
                );
            }

            const user = await User.findById(userId);
            if (!user) {
                return new NextResponse(
                    JSON.stringify({ message: "User not found in database" }),
                    { status: 404 }
                );
            }

            const reviews = await Review.find({ user: new Types.ObjectId(userId) });
            return new NextResponse(JSON.stringify(reviews), { status: 200 });
        }

        // Om ingen userId eller bookId anges, hämta alla recensioner
        const reviews = await Review.find();
        return new NextResponse(JSON.stringify(reviews), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error in fetching reviews: " + error.message, {
            status: 500,
        });
    }
};


// POST - Create new review
export const POST = async (request: NextRequest) => {
    try {
        const { comment, rating, bookId } = await request.json(); // Lägg till bookId

        // Kontrollera att bookId finns i requesten
        if (!bookId) {
            return new NextResponse(JSON.stringify({ message: "bookId is required" }), { status: 400 });
        }

        // Kolla autentisering
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token) as JwtPayload | null;
        if (!decoded || !decoded.userId) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        await connect();

        // Inkludera bookId i databasen
        const newReview = new Review({
            comment,
            rating,
            bookId, // Lägg till bookId 
            user: new Types.ObjectId(decoded.userId),
        });

        await newReview.save();

        return new NextResponse(
            JSON.stringify({ message: "Review is created", review: newReview }),
            { status: 201 }
        );

    } catch (error: any) {
        return new NextResponse("Error in creating review: " + error.message, { status: 500 });
    }
};

