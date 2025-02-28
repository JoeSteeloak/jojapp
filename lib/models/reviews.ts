import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
    {
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
     },
     {
         timestamps: true,
     }
);

const Review = models.Review || model("Review", ReviewSchema);

export default Review;