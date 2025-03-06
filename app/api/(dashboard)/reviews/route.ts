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
        const bookId = searchParams.get("bookId");

        let query: any = {};

        if (bookId) {
            query.bookId = bookId;
        }

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

            query.user = new Types.ObjectId(userId);
        }

        const reviews = await Review.find(query).populate("user", "username");

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
        const { comment, rating, bookId } = await request.json();

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

        const newReview = new Review({
            comment,
            rating,
            bookId,
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

