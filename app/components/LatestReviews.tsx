import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    useEffect(() => {
        fetch("/api/reviews")
            .then((res) => res.json())
            .then((data: Review[]) => {
                // Hämta boktitlar
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

    const handleBookClick = (bookId: string) => {
        router.push(`/book/${bookId}`); // Navigera till boksidan med rätt bookId
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Latest Reviews</h2>
            {reviews.length > 0 ? (
                <ul className="space-y-6">
                    {reviews.map((review) => (
                        <li key={review._id} className="p-4 border-b border-gray-200 rounded-lg hover:bg-gray-50 transition duration-300 ease-in-out">
                            
                            <p 
                                className="text-lg font-semibold text-blue-600 cursor-pointer hover:underline"
                                onClick={() => handleBookClick(review.bookId)} // Gåt till bok med id
                            >
                                {bookTitles[review.bookId] || "Loading title..."}
                            </p>
                            
                            <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                            
                            <p className="text-yellow-500 text-lg mb-2">
                                {"⭐".repeat(review.rating)}
                            </p>
                            
                            <p className="text-xs text-gray-500">
                                {review.user ? review.user.username : "Anonymous"}
                            </p>
                            
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
