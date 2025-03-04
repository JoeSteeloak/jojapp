"use client";

import { useEffect, useState } from "react";

const BookReviews = ({ bookId }: { bookId: string }) => {
    const [reviews, setReviews] = useState<{ id: string; user: string; comment: string; rating: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?bookId=${bookId}`);
                if (!res.ok) throw new Error("Failed to fetch reviews");
                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error(error);
                setError("Could not load reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [bookId]);

    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold">Recensioner</h2>
            {reviews.length > 0 ? (
                <ul className="mt-4 space-y-2">
                    {reviews.map((review) => (
                        <li key={review.id} className="border p-2 rounded-lg">
                            <p className="font-semibold">{review.user}:</p>
                            <p>{review.comment}</p>
                            <p>{review.rating}/5</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Inga recensioner än.</p>
            )}
        </div>
    );
};

export default BookReviews;
