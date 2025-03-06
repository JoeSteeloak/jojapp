"use client";

import React, { useState, useEffect } from "react";
import { BookInterface } from "@/app/types/BookInterface";
import { Search } from "lucide-react";

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
        <div className="mb-6">
            <div className="flex gap-3 items-center max-w-200 mx-auto">
                <input
                    type="text"
                    className="border border-gray-300 bg-white p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter book title..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                    className={`bg-blue-600 text-white px-4 min-w-30 py-3 rounded-lg mx-autotransition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSearch}
                    disabled={loading}
                >
                    <Search className="inline-block mr-2" size={18} />
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
            {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </div>

    );
};

export default SearchBar;
