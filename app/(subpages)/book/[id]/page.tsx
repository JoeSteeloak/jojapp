import BookDetails from "@/app/components/BookDetails";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  return (
    <div>
      <BookDetails bookId={id} />
    </div>
  )
}

export default page