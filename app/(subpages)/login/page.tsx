import LoginForm from "@/app/components/LoginForm";
import Link from "next/link";


const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Don&apos;t have an account? Register
            </h2>
            <Link href="/register" className="text-blue-500 hover:underline mb-1">
                here!
            </Link>
            <LoginForm />

        </div>
    );

};

export default Login;