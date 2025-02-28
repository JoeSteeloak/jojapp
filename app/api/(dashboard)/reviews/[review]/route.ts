import connect from "@/lib/db";
import User from "@/lib/models/users";
import Review from "@/lib/models/reviews";
import { Types } from "mongoose";
import { NextResponse } from "next/server";


export const PATCH = async (request: Request, context: {params: any}) => {
    const reviewId = context.params.review;
    try {
        const body = await request.json();
        const { comment, rating } = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing user id" }),
                { status: 400 }
            );
        }

        if (!reviewId || !Types.ObjectId.isValid(reviewId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing review id" }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in database" }),
                { status: 404 }
            );
        }

        const review = await Review.findOne({_id: reviewId, user: userId})

        if (!review) {
            return new NextResponse(
                JSON.stringify({ message: "Review not found" }),
                { status: 404 }
            );
        }

        const updatedReview = await Review.findByIdAndUpdate(reviewId, { comment, rating }, { new: true });

        return new NextResponse(JSON.stringify({ message: "Review updated successfully", review: updatedReview }), { status: 200 });
        
    } catch (error: any) {
        return new NextResponse("Error in updating user" + error.message, {
            status: 500,
        });
        
    }
}