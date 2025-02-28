import connect from "@/lib/db";
import User from "@/lib/models/users";
import Review from "@/lib/models/reviews";
import { Types } from "mongoose";
import { NextResponse } from "next/server";


export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing user id" }),
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

        const reviews = await Review.find({ user: new Types.ObjectId(userId),
         });

         return new NextResponse(JSON.stringify(reviews ), { status: 200 });

    } catch (error: any) {
        return new NextResponse("Error in fetching reviews" + error.message, {
            status: 500,
        });
     }

}