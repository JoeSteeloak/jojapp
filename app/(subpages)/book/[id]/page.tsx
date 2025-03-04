import BookDetails from "@/app/components/BookDetails";
import BookReviews from "@/app/components/BookReviews";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  return (
    <div>
      <BookDetails bookId={id} />
      <BookReviews bookId={id} />
    </div>
  )
}

export default page