"use client";

import { useState, useEffect } from "react";

interface Review {
    _id: string;
    comment: string;
    rating: number;
    bookId: string;
    user: { username: string } | null;
}

const BookReviews = ({ bookId, reviewsUpdated }: { bookId: string; reviewsUpdated: boolean }) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?bookId=${bookId}`);
            const data = await res.json();
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [bookId, reviewsUpdated]); // När reviewsUpdated ändras, hämta recensionerna på nytt

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>

            {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((review) => (
                <div key={review._id} className="border p-4 my-2">
                    <h3 className="font-bold">{review.user?.username || "Unknown user"}</h3>
                    <p>{review.comment}</p>
                    <p>
                        Rating:
                        {review.rating === 1 && "⭐"}
                        {review.rating === 2 && "⭐⭐"}
                        {review.rating === 3 && "⭐⭐⭐"}
                        {review.rating === 4 && "⭐⭐⭐⭐"}
                        {review.rating === 5 && "⭐⭐⭐⭐⭐"}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default BookReviews;
