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
        <div className="mt-6">
            <h2 className="text-lg font-bold">Write a review</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <textarea
                    className="border p-2"
                    placeholder="Write a review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                ></textarea>

                <label>
                    Rating:
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 ml-2">
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
                </label>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2">Send review</button>
            </form>
        </div>
    );
};

export default ReviewForm;
