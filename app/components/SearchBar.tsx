"use client";

import React, { useState, useEffect } from "react";
import { BookInterface } from "@/app/types/BookInterface";

interface SearchBarProps {
    onResults: (books: BookInterface[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onResults }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Hämta senaste sökning från sessionStorage
        const savedQuery = sessionStorage.getItem("lastSearchQuery");
        const savedResults = sessionStorage.getItem("lastSearchResults");

        if (savedQuery && savedResults) {
            setQuery(savedQuery);
            onResults(JSON.parse(savedResults)); // Återställ tidigare sökresultat
        }
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=en&maxResults=40`
            );

            if (!response.ok) throw new Error("Failed to fetch books");

            const data = await response.json();

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

            // Spara i sessionStorage
            sessionStorage.setItem("lastSearchQuery", query);
            sessionStorage.setItem("lastSearchResults", JSON.stringify(booksData));

            onResults(booksData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Enter book title or author..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default SearchBar;
