// Komponentformulär för att skapa en ny recension
"use client";

import { useState } from "react";

const ReviewForm = ({ bookId, onReviewAdded }: { bookId: string; onReviewAdded: () => void }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState<number>(5);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const token = localStorage.getItem("token"); // Hämta JWT-token från localStorage
            if (!token) {
                setError("Du måste vara inloggad för att skriva en recension.");
                return;
            }

            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment, rating, bookId }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Något gick fel.");
            }

            // Rensa formuläret
            setComment("");
            setRating(5);

            // Trigga uppdatering i page.tsx
            onReviewAdded();

        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md pt-3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add review</h2>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 rounded-xl shadow-sm mx-auto max-w-6xl">
                <label className="block text-sm font-medium text-gray-600 mb-2">Write a review</label>
                <textarea
                    className="border border-gray-300 p-4 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                ></textarea>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Rating</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border border-gray-300 p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num}{" "}
                                {num === 1 && "⭐"}
                                {num === 2 && "⭐⭐"}
                                {num === 3 && "⭐⭐⭐"}
                                {num === 4 && "⭐⭐⭐⭐"}
                                {num === 5 && "⭐⭐⭐⭐⭐"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-4 text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                    >
                        Send review
                    </button>
                </div>
            </form>
        </div>

    );
};

export default ReviewForm;
