
"use client";
import React, { useState } from "react";

interface BookInterface {
    id: string;
    title: string;
    author: string;
    publishedDate: string;
    pageCount: number;
    isbn: string;
    bookCover: string;
    description: string;
    genre: string[];
}

const Search = () => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState<BookInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${query}`
            );
            if (!response.ok) throw new Error("Failed to fetch books");

            const data = await response.json();

            // Mappar om API-responsen till vår BookInterface-struktur
            const booksData: BookInterface[] = data.items?.map((item: any) => ({
                id: item.id,
                title: item.volumeInfo.title || "Unknown Title",
                author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
                publishedDate: item.volumeInfo.publishedDate || "Unknown Date",
                pageCount: item.volumeInfo.pageCount || 0,
                isbn: item.volumeInfo.industryIdentifiers
                    ? item.volumeInfo.industryIdentifiers[0].identifier
                    : "Unknown ISBN",
                bookCover: item.volumeInfo.imageLinks?.thumbnail || "",
                description: item.volumeInfo.description || "No description available",
                genre: item.volumeInfo.categories || ["Unknown Genre"],
            })) || [];

            setBooks(booksData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Search for Books</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Enter book title or author..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                    <div key={book.id} className="border p-4 rounded shadow">
                        {book.bookCover && (
                            <img src={book.bookCover} alt={book.title} className="mb-2 w-full h-48 object-cover" />
                        )}
                        <h3 className="text-lg font-bold">{book.title}</h3>
                        <p className="text-gray-600">{book.author}</p>
                        <p className="text-sm text-gray-500">{book.publishedDate}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
