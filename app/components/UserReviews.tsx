"use client";

import { useState, useEffect } from "react";

interface Review {
    _id: string;
    comment: string;
    rating: number;
    bookId: string;
    bookTitle: string;
}

const UserReviews = ({ userId }: { userId: string }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [deletingReview, setDeletingReview] = useState<Review | null>(null);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);

    const fetchUserReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?userId=${userId}`);
            if (!res.ok) throw new Error("Failed to fetch reviews");
            const data = await res.json();
            setReviews(data);
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
            const res = await fetch(`/api/reviews/${deletingReview._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete review");
            setReviews(reviews.filter((review) => review._id !== deletingReview._id));
            setDeletingReview(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleEdit = (review: Review) => {
        setEditingReview(review);
        setNewComment(review.comment);
        setNewRating(review.rating);
    };

    const updateReview = async () => {
        if (!editingReview) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You need to be logged in to edit a review.");
                return;
            }
            const res = await fetch(`/api/reviews/${editingReview._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ comment: newComment, rating: newRating }),
            });
            if (!res.ok) throw new Error("Failed to edit review");
            setReviews(reviews.map((r) => (r._id === editingReview._id ? { ...r, comment: newComment, rating: newRating } : r)));
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
                            <p><strong>{review.bookTitle}</strong></p>
                            <p>{review.comment}</p>
                            <p>Rating: {review.rating} ⭐</p>
                            <button onClick={() => handleEdit(review)} className="text-blue-500">Edit</button>
                            <button onClick={() => setDeletingReview(review)} className="text-red-500 ml-4">Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Edit Modal */}
            {editingReview && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg">
                        <h2 className="text-lg font-bold">Edit Review</h2>
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full border p-2" />
                        <input type="number" value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} className="border p-2 w-full mt-2" />
                        <button onClick={updateReview} className="bg-blue-500 text-white p-2 mt-2 rounded">Save</button>
                        <button onClick={() => setEditingReview(null)} className="text-red-500 ml-2">Cancel</button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingReview && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg">
                        <h2 className="text-lg font-bold">Are you sure you want to delete this review?</h2>
                        <p>{deletingReview.comment}</p>
                        <button onClick={handleDelete} className="bg-red-500 text-white p-2 mt-2 rounded">Yes, Delete</button>
                        <button onClick={() => setDeletingReview(null)} className="text-gray-500 ml-2">No, Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReviews;
