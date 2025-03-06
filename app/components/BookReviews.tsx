// komponent som visar alla recensioner för enskild bok 
"use client";

import { useState, useEffect } from "react";

interface Review {
    _id: string;
    comment: string;
    rating: number;
    bookId: string;
    user: { username: string } | null;
    createdAt: string;
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
    }, [bookId, reviewsUpdated]);

    // Sortera recensionerna så att de nyaste kommer först
    const sortedReviews = [...reviews].sort((a, b) => {

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Reviews</h2>

            {sortedReviews.length === 0 ? (
                <p className="text-gray-500 text-center text-xl">No reviews yet...</p>
            ) : (
                sortedReviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow-sm p-4 mb-4 mx-auto max-w-6xl">
                        <h3 className="font-semibold text-gray-800">{review.user?.username || "Unknown user"}</h3>
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                        <p className="mt-2 text-gray-500">
                            Rating:
                            {"⭐".repeat(review.rating)}
                        </p>
                    </div>
                ))
            )}
        </div>

    );
};

export default BookReviews;
