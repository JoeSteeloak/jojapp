import { useState, useEffect } from "react";

interface Review {
    _id: string;
    comment: string;
    rating: number;
    createdAt: string; // Timestamp
    bookId: string; // Lägg till bookId
    user?: { username: string }; // Användare som gjort review
}

const LatestReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookTitles, setBookTitles] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetch("/api/reviews")
            .then((res) => res.json())
            .then((data: Review[]) => {
                // Hämta boktitlar asynkront
                const fetchTitles = async () => {
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
                };

                fetchTitles();

                // Sortera och sätt reviews
                const latestReviews = data
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5);
                setReviews(latestReviews);
            })
            .catch((err) => console.error("Error fetching reviews:", err));
    }, []);

    return (
<div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Latest Reviews</h2>
    {reviews.length > 0 ? (
        <ul className="space-y-6">
            {reviews.map((review) => (
                <li key={review._id} className="p-4 border-b border-gray-200 rounded-lg hover:bg-gray-50 transition duration-300 ease-in-out">
                    {/* Boktitel */}
                    <p className="font-semibold text-lg text-gray-900 mb-2">
                        {bookTitles[review.bookId] || "No book title"}
                    </p>
                    {/* Kommentar */}
                    <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                    {/* Betyg */}
                    <p className="text-yellow-500 text-lg mb-2">
                        {"⭐".repeat(review.rating)}
                    </p>
                    {/* Användare */}
                    <p className="text-xs text-gray-500">
                        {review.user ? review.user.username : "Anonymous"}
                    </p>
                    {/* Datum */}
                    <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                </li>
            ))}
        </ul>
    ) : (
        <p className="text-gray-500 text-center">No reviews yet.</p>
    )}
</div>

    );
};

export default LatestReviews;
