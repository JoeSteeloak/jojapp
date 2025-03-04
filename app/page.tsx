import RegisterForm from "./components/RegisterForm";
export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4">
        <p>Register user below</p>
        <RegisterForm />
      </div>
    </>
  );
}