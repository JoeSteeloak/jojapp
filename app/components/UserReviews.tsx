"use client";

import { useState, useEffect } from "react";

interface Review {
    _id: string;
    comment: string;
    rating: number;
    bookId: string;
}

const UserReviews = ({ userId }: { userId: string }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [deletingReview, setDeletingReview] = useState<Review | null>(null);
    const [bookTitles, setBookTitles] = useState<{ [key: string]: string }>({});
    const [editedComment, setEditedComment] = useState<string>("");
    const [editedRating, setEditedRating] = useState<number>(0);

    const fetchUserReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?userId=${userId}`);
            if (!res.ok) throw new Error("Failed to fetch reviews");
            const data = await res.json();
            setReviews(data);

            // Hämta boktitlar
            const titles: { [key: string]: string } = {};
            await Promise.all(
                data.map(async (review: Review) => {
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
            <h2 className="text-xl font-bold">Your reviews</h2>
            {error && <p className="text-red-500">{error}</p>}
            {reviews.length === 0 ? (
                <p>You have no reviews yet...</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review._id} className="border p-4 my-2">
                            <p><strong>{bookTitles[review.bookId] || "Loading book title..."}</strong></p>
                            <p>{review.comment}</p>
                            <p>Rating: {"⭐".repeat(review.rating)}</p>
                            <button
                                onClick={() => {
                                    setEditingReview(review);
                                    setEditedComment(review.comment);
                                    setEditedRating(review.rating);
                                }}
                                className="text-blue-500"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setDeletingReview(review)}
                                className="text-red-500 ml-4"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Edit modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-2">Edit Review</h3>
                        <textarea
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="number"
                            value={editedRating}
                            onChange={(e) => setEditedRating(Number(e.target.value))}
                            className="w-full p-2 border rounded mt-2"
                        />
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                            <button onClick={() => setEditingReview(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm modal */}
            {deletingReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-2">Are you sure you want to delete this review?</h3>
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Yes, Delete</button>
                            <button onClick={() => setDeletingReview(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReviews;
