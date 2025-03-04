"use client";

import BookDetails from "@/app/components/BookDetails";
import BookReviews from "@/app/components/BookReviews";
import ReviewForm from "@/app/components/ReviewForm";
import { useState } from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [reviewsUpdated, setReviewsUpdated] = useState(false);

  // När en recension är skapad, sätt reviewsUpdated till true för att uppdatera recensionerna
  const handleReviewAdded = () => {
    setReviewsUpdated((prev) => !prev);
  };

  return (
    <div>
      <BookDetails bookId={id} />

      {/* Formulär för att skapa recensioner */}
      <ReviewForm bookId={id} />

      {/* Lista av recensioner */}
      <BookReviews bookId={id} reviewsUpdated={reviewsUpdated} />
    </div>
  );
};

export default page;
