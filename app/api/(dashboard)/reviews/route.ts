import connect from "@/lib/db";
import User from "@/lib/models/users";
import Review from "@/lib/models/reviews";
import { Types } from "mongoose";
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";

// GET Reviews (All or By User)
export const GET = async (request: NextRequest) => {
    try {
        await connect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

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

        // Om ingen userId anges, hämta alla recensioner
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
        const { comment, rating } = await request.json();

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

        const newReview = new Review({ comment, rating, user: new Types.ObjectId(decoded.userId) });
        await newReview.save();
        return new NextResponse(JSON.stringify({ message: "Review is created", review: newReview }), { status: 201 });

    } catch (error: any) {
        return new NextResponse("Error in creating review: " + error.message, { status: 500 });
    }
};

// PATCH - Update a review (Protected)
export const PATCH = async (request: NextRequest) => {
    try {
        await connect();

        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token) as JwtPayload | null;
        if (!decoded || !decoded.userId) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const { reviewId, comment, rating } = await request.json();

        if (!reviewId || !Types.ObjectId.isValid(reviewId) || !comment || !rating || rating < 1 || rating > 5) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing review id, comment, or rating" }),
                { status: 400 }
            );
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return new NextResponse(JSON.stringify({ message: "Review not found" }), { status: 404 });
        }

        if (review.user.toString() !== decoded.userId) {
            return new NextResponse(JSON.stringify({ message: "You are not authorized to edit this review" }), { status: 403 });
        }

        review.comment = comment;
        review.rating = rating;
        await review.save();

        return new NextResponse(JSON.stringify({ message: "Review updated", review }), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error in updating review: " + error.message, { status: 500 });
    }
};

// DELETE - Remove a review (Protected)
export const DELETE = async (request: NextRequest) => {
    try {
        await connect();
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token) as JwtPayload | null;
        if (!decoded || !decoded.userId) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const reviewId = searchParams.get("reviewId");

        if (!reviewId || !Types.ObjectId.isValid(reviewId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing review id" }), { status: 400 });
        }

        const review = await Review.findById(reviewId);
        if (!review) {
            return new NextResponse(JSON.stringify({ message: "Review not found" }), { status: 404 });
        }

        if (review.user.toString() !== decoded.userId) {
            return new NextResponse(JSON.stringify({ message: "You are not authorized to delete this review" }), { status: 403 });
        }

        await review.deleteOne();

        return new NextResponse(JSON.stringify({ message: "Review deleted" }), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error in deleting review: " + error.message, { status: 500 });
    }
};
