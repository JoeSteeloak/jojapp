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
        <div className="p-6">
            <h1 className="text-2xl font-bold">{book.volumeInfo.title}</h1>
            <p className="text-gray-600">{book.volumeInfo.authors?.join(", ")}</p>
            <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} className="my-4"/>
            <p>{book.volumeInfo.description}</p>
            <p><strong>Published:</strong> {book.volumeInfo.publishedDate}</p>
            <p><strong>Pages:</strong> {book.volumeInfo.pageCount}</p>
        </div>
    );
};

export default BookDetails;
