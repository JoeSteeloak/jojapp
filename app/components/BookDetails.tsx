"use client";

import React, { useEffect, useState } from "react";

const BookDetails = ({ bookId }: { bookId: string }) => {
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookId) {
            setLoading(false);
            return;
        }

        const fetchBook = async () => {
            try {
                const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
                if (!res.ok) {
                    setBook(null);
                    setError("Book not found");
                    return;
                }
                const data = await res.json();
                setBook(data);
            } catch (error) {
                console.error("Failed to fetch book", error);
                setError("Failed to fetch book details");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!book) return <p>Book not found</p>;

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md pt-3">
            <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">{book.volumeInfo.title}</h1>

                <p className="text-lg text-gray-600 mb-2">{book.volumeInfo.authors?.join(", ")}</p>

                <img
                    src={book.volumeInfo.imageLinks?.thumbnail}
                    alt={book.volumeInfo.title}
                    className="my-4 max-w-full h-auto rounded-md shadow-sm"
                />

                <p
                    dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }}
                    className="text-gray-700 mb-4"
                />

                <div className="space-y-2 text-gray-800">
                    <p><strong className="font-semibold">Published:</strong> {book.volumeInfo.publishedDate}</p>
                    <p><strong className="font-semibold">Pages:</strong> {book.volumeInfo.pageCount}</p>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
