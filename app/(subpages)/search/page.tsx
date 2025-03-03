"use client";

import React, { useState } from "react";
import SearchBar  from "@/app/components/SearchBar";
import { BookInterface } from "@/app/types/BookInterface";

const Search = () => {
    const [books, setBooks] = useState<BookInterface[]>([]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Search for Books</h2>
            <SearchBar onResults={setBooks} />

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
