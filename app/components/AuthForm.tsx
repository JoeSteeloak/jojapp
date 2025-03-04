"use client";

import { useState } from "react";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        const url = isLogin ? "/api/auth" : "/api/users"; // Anpassa beroende på login eller register
        const body = isLogin ? { email, password } : { username, email, password };

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error(isLogin ? "Login failed" : "Registration failed");
            }

            if (isLogin) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                window.location.href = "/user"; 
            } else {
                alert("Account created successfully! You can now log in.");
                setIsLogin(true); 
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 rounded ${isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 rounded ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Register
                    </button>
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">{isLogin ? "Login" : "Register"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border p-2 rounded"
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default AuthForm;
