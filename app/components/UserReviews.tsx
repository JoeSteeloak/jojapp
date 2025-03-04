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

    const fetchUserReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?userId=${userId}`);
            if (!res.ok) throw new Error("Failed to fetch reviews");
            const data = await res.json();
            setReviews(data);

            // Hämta boktitlar
            const titles: { [key: string]: string } = {};
            await Promise.all(data.map(async (review: Review) => {
                const bookRes = await fetch(`https://www.googleapis.com/books/v1/volumes/${review.bookId}`);
                if (bookRes.ok) {
                    const bookData = await bookRes.json();
                    titles[review.bookId] = bookData.volumeInfo.title;
                }
            }));
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

            const res = await fetch(`/api/reviews/${deletingReview._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete review");
            setReviews(reviews.filter((r) => r._id !== deletingReview._id));
            setDeletingReview(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleEdit = async (newComment: string, newRating: number) => {
        if (!editingReview) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You need to be logged in to edit a review.");
                return;
            }

            const res = await fetch(`/api/reviews/${editingReview._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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
                            <p><strong>{bookTitles[review.bookId] || "Laddar boktitel..."}</strong></p>
                            <p>{review.comment}</p>
                            <p>Rating: {review.rating} ⭐</p>
                            <button onClick={() => setEditingReview(review)} className="text-blue-500">Edit</button>
                            <button onClick={() => setDeletingReview(review)} className="text-red-500 ml-4">Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Edit modal */}
            {editingReview && (
                <div className="modal">
                    <h3>Edit Review</h3>
                    <textarea defaultValue={editingReview.comment} id="editComment"></textarea>
                    <button onClick={() => handleEdit((document.getElementById("editComment") as HTMLTextAreaElement).value, editingReview.rating)}>Save</button>
                    <button onClick={() => setEditingReview(null)}>Cancel</button>
                </div>
            )}

            {/* Delete confirm modal */}
            {deletingReview && (
                <div className="modal">
                    <h3>Are you sure you want to delete this review?</h3>
                    <button onClick={handleDelete} className="text-red-500">Yes, Delete</button>
                    <button onClick={() => setDeletingReview(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default UserReviews;
