"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import Link from "next/link";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }

            setSuccess("Account created successfully! You can now log in.");
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 p-6 min-h-screen items-center">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8 mt-6">
                <h2 className="text-lg font-semibold text-gray-700 text-center mb-2">
                    Already have an account?
                    <Link href="/login" className="text-blue-500 hover:underline ml-1 text-lg">
                        Login here!
                    </Link>
                </h2>
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Register</h2>
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
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
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium p-3 rounded-md transition duration-300 cursor-pointer flex items-center justify-center"
                    >
                        <UserPlus className="inline-block mr-2" size={18} />
                        Register
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mt-3">{success}</p>}
            </div>
        </div>
    );
};

export default RegisterForm;

