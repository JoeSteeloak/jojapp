import { notFound } from "next/navigation";

const BookPage = async ({ params }: { params: { bookId: string } }) => {
    const { bookId } = params;

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    if (!res.ok) {
        return notFound();
    }

    const book = await res.json();

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

export default BookPage;
