"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // Importera useParams från Next.js
import BookDetails from "@/app/components/BookDetails";
import BookReviews from "@/app/components/BookReviews";
import ReviewForm from "@/app/components/ReviewForm";

const Page = () => {
  const params = useParams(); // Hämta params som objekt
  const id = params.id as string; // Hämta id och tvinga till string

  const [reviewsUpdated, setReviewsUpdated] = useState(false);

  const handleReviewAdded = () => {
    setReviewsUpdated((prev) => !prev);
  };

  return (
    <div>
      <BookDetails bookId={id} />
      <ReviewForm bookId={id} onReviewAdded={handleReviewAdded} />
      <BookReviews bookId={id} reviewsUpdated={reviewsUpdated} />
    </div>
  );
};

export default Page;
