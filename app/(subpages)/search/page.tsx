import React from "react";

interface BookInterface {
    _id: string;
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
    return <div>Search</div>;
};

export default Search;