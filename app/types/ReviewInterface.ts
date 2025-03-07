export interface ReviewInterface {
    _id: string;
    comment: string;
    rating: number;
    bookId: string;
    user?: { username: string }; // Inte obligatoriskt
    createdAt: string; // Inte obligatoriskt
}