// Komponent för att ladda in den aktiva användarns recensioner
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { ReviewInterface } from "../types/ReviewInterface";

const UserReviews = ({ userId }: { userId: string }) => {
    const [reviews, setReviews] = useState<ReviewInterface[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingReview, setEditingReview] = useState<ReviewInterface | null>(null);
    const [deletingReview, setDeletingReview] = useState<ReviewInterface | null>(null);
    const [bookTitles, setBookTitles] = useState<{ [key: string]: string }>({});
    const [editedComment, setEditedComment] = useState<string>("");
    const [editedRating, setEditedRating] = useState<number>(0);
    const router = useRouter()

    const fetchUserReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?userId=${userId}`);
            if (!res.ok) throw new Error("Failed to fetch reviews");
            const data = await res.json();
            setReviews(data);

            // Hämta boktitlar
            const titles: { [key: string]: string } = {};
            await Promise.all(
                data.map(async (review: ReviewInterface) => {
                    const bookRes = await fetch(`https://www.googleapis.com/books/v1/volumes/${review.bookId}`);
                    if (bookRes.ok) {
                        const bookData = await bookRes.json();
                        titles[review.bookId] = bookData.volumeInfo?.title || "Unknown title";
                    } else {
                        titles[review.bookId] = "Unknown title";
                    }
                })
            );
            setBookTitles(titles);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserReviews();
        }
    }, [userId]);

    const handleDelete = async () => {
        if (!deletingReview) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You need to be logged in to delete a review.");
                return;
            }

            const res = await fetch(`/api/reviews/${deletingReview._id}?userId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete review");
            }

            setReviews(reviews.filter((r) => r._id !== deletingReview._id));
            setDeletingReview(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleEdit = async () => {
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
                body: JSON.stringify({ comment: editedComment, rating: editedRating }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to edit review");
            }

            setReviews(reviews.map((r) => (r._id === editingReview._id ? { ...r, comment: editedComment, rating: editedRating } : r)));
            setEditingReview(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6 mt-5">Your Reviews</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {reviews.length === 0 ? (
                <p className="text-lg text-gray-500 text-center">You have no reviews yet...</p>
            ) : (
                <ul className="space-y-4">
                    {reviews.map((review) => (
                        <li key={review._id} className="bg-white mx-auto max-w-6xl rounded-lg shadow-md p-6 transition-transform hover:scale-102 transform duration-200 w-9/10">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-lg font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => router.push(`/book/${review.bookId}`)}>
                                    {bookTitles[review.bookId] || "Loading book title..."}
                                </p>
                                <p className="text-sm text-gray-500">Rating: {"⭐".repeat(review.rating)}</p>
                            </div>

                            <p className="text-gray-700 mb-4">{review.comment}</p>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        setEditingReview(review);
                                        setEditedComment(review.comment);
                                        setEditedRating(review.rating);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                                >
                                    <Pencil className="inline-block mr-2" size={17} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeletingReview(review)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200 ml-4 cursor-pointer"
                                >
                                    <Trash2 className="inline-block mr-2" size={17} />
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}


            {/* Edit modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-2">Edit Review</h3>
                        <label className="block text-sm font-medium text-gray-600 mb-2">New review</label>
                        <textarea
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <div>

                            {/* Rating dropdown */}
                            <label className="block text-sm font-medium text-gray-600 mt-4 mb-2">New rating</label>
                            <select
                                value={editedRating}
                                onChange={(e) => setEditedRating(Number(e.target.value))}
                                className="border border-gray-300 p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {`${"⭐".repeat(num)} ${num}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded mr-2 cursor-pointer hover:bg-blue-600">Save</button>
                            <button onClick={() => setEditingReview(null)} className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm modal */}
            {deletingReview && (
                <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-2">Are you sure you want to delete this review?</h3>
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2 cursor-pointer hover:bg-red-600">Yes, Delete</button>
                            <button onClick={() => setDeletingReview(null)} className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReviews;
