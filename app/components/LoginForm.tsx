"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("Login failed");
            }

            const data = await res.json();
            localStorage.setItem("token", data.token); // Spara JWT-token i localStorage
            window.location.href = "/user"; // Omdirigera vid lyckad inloggning
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 p-6 items-center min-h-screen">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 text-center mb-2">
                Don&apos;t have an account? 
                <Link href="/register" className="text-blue-500 hover:underline ml-1 text-lg">
                    Register here!
                </Link>
            </h2>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition duration-300 cursor-pointer flex items-center justify-center"
                >
                    <LogIn className="inline-block mr-2" size={18} />
                    Login
                </button>
            </form>
            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
        </div>
    </div>
    


    );
};

export default LoginForm;
