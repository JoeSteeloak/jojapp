import RegisterForm from "./components/RegisterForm";
export default function Home() {
  return (
    <>
      <section className="welcome-section py-12 bg-gray-100 min-h-screen mx-auto">
        <div className="container text-center max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to Our Book Review Site!</h1>
          <p className="text-lg text-gray-700 mb-6">
            On our site, you can discover and read reviews of books pulled from the Google Books API. Both registered users and guests can explore books and share their own opinions.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            If you're logged in, you can also create, edit, or delete your own reviews, and update your user information. If you're not logged in, you can still search for books and read others' reviews.
          </p>
          <p className="text-lg text-gray-700">
            To get started, create an account or log in to start writing your own reviews!
          </p>
        </div>
      </section>
    </>

  );
}