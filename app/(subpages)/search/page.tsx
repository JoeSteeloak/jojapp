"use client";

import React, { useState } from "react";
import SearchBar from "@/app/components/SearchBar";
import { BookInterface } from "@/app/types/BookInterface";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

const Search = () => {
    const [books, setBooks] = useState<BookInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Beräkna vilka böcker som ska visas på den aktuella sidan
    const indexOfLastBook = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstBook = indexOfLastBook - ITEMS_PER_PAGE;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Search for Books</h2>
            <SearchBar onResults={setBooks} />

            {books.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Cover</th>
                                <th className="border border-gray-300 p-2">Title</th>
                                <th className="border border-gray-300 p-2">Author</th>
                                <th className="border border-gray-300 p-2">Published</th>
                                <th className="border border-gray-300 p-2">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBooks.map((book) => (
                                <tr key={book.id} className="text-center">
                                    <td className="border border-gray-300 p-2">
                                        {book.bookCover && (
                                            <img src={book.bookCover} alt={book.title} className="max-w-[100px] max-h-[150px] object-contain" />
                                        )}
                                    </td>
                                    <td className="border border-gray-300 p-2">{book.title}</td>
                                    <td className="border border-gray-300 p-2">{book.author}</td>
                                    <td className="border border-gray-300 p-2">{book.publishedDate}</td>
                                    <td className="border border-gray-300 p-2">
                                        <Link href={"/book/" + book.id}>
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                                View Details
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginering */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 border ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No books found.</p>
            )}
        </div>
    );
};

export default Search;
