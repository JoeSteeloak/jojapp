"use client";

import { useState, useEffect } from "react";

interface Review {
    _id: string;
    comment: string;
    rating: number;
    bookId: string;
}

interface Book {
    id: string;
    title: string;
}

const UserReviews = ({ userId }: { userId: string }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [books, setBooks] = useState<{ [key: string]: string }>({}); // Lagrar boktitlar
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState<number>(0);

    useEffect(() => {
        if (userId) {
            fetchUserReviews();
        }
    }, [userId]);

    const fetchUserReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?userId=${userId}`);
            if (!res.ok) throw new Error("Failed to fetch reviews");

            const data: Review[] = await res.json();
            setReviews(data);

            // Hämta boktitlar för varje recension
            data.forEach((review) => fetchBookTitle(review.bookId));
        } catch (error: any) {
            setError(error.message);
        }
    };

    const fetchBookTitle = async (bookId: string) => {
        if (books[bookId]) return; // Om vi redan har boktiteln, hämta inte igen

        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
            if (!res.ok) throw new Error("Failed to fetch book details");

            const data = await res.json();
            setBooks((prev) => ({ ...prev, [bookId]: data.volumeInfo.title }));
        } catch (error: any) {
            console.error("Error fetching book title:", error);
        }
    };

    const handleDelete = async (reviewId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You need to be logged in to delete a review.");
                return;
            }

            const res = await fetch(`/api/reviews/${reviewId}?userId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete review");

            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (error: any) {
            setError(error.message);
        }
    };

    const openEditModal = (review: Review) => {
        setEditingReview(review);
        setNewComment(review.comment);
        setNewRating(review.rating);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingReview) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You need to be logged in to edit a review.");
                return;
            }

            const res = await fetch(`/api/reviews/${editingReview._id}?userId=${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment: newComment, rating: newRating }),
            });

            if (!res.ok) throw new Error("Failed to update review");

            const updatedReview = await res.json();
            setReviews(reviews.map((r) => (r._id === editingReview._id ? updatedReview.review : r)));

            setIsModalOpen(false);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold">Your reviews</h2>
            {error && <p className="text-red-500">{error}</p>}
            {reviews.length === 0 ? (
                <p>You have no reviews yet...</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review._id} className="border p-4 my-2">
                            <p className="text-lg font-semibold">
                                {books[review.bookId] || "Loading title..."}
                            </p>
                            <p>{review.comment}</p>
                            <p>Rating: {review.rating} ⭐</p>
                            <button
                                onClick={() => openEditModal(review)}
                                className="text-blue-500"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(review._id)}
                                className="text-red-500 ml-4"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal för att redigera en recension */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Review</h2>
                        <textarea
                            className="w-full border p-2 mb-2"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <input
                            type="number"
                            className="w-full border p-2 mb-4"
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                            min={1}
                            max={5}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mr-2 bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReviews;
