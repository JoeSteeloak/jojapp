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
        <div className="bg-gray-100 min-h-screen">
            <div className="p-6 rounded-xl mx-auto max-w-6xl">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Search for Books</h2>
                <SearchBar onResults={setBooks} />

                {books.length > 0 ? (
                    <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-gray-300">
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Cover</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Title</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Author</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Published</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBooks.map((book) => (
                                    <tr key={book.id} className="border-t transition-transform hover:scale-101 transform duration-200">
                                        <td className="p-4">
                                            {book.bookCover && (
                                                <img src={book.bookCover} alt={book.title} className="max-w-[80px] max-h-[120px] object-contain mx-auto" />
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-700">{book.title}</td>
                                        <td className="p-4 text-sm text-gray-700">{book.author}</td>
                                        <td className="p-4 text-sm text-gray-700">{book.publishedDate}</td>
                                        <td className="p-4">
                                            <Link href={"/book/" + book.id}>
                                                <button className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-200 cursor-pointer">
                                                    View Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Paginering */}
                        <div className="flex justify-center mt-8 space-x-3 pb-5 overflow-x-auto">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No books found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;

