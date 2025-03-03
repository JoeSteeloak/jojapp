"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { UserInterface } from "@/app/types/UserInterface";

const User = () => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:3000/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data: UserInterface = await res.json();
                    setUser(data);
                    setUpdatedName(data.name);
                    setUpdatedEmail(data.email);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("http://localhost:3000/api/users", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: updatedName,
                    email: updatedEmail,
                    password: password || undefined, // Skicka endast om fältet är ifyllt
                }),
            });

            if (res.ok) {
                const updatedUser: UserInterface = await res.json();
                setUser(updatedUser);
                setMessage("Profile updated successfully!");
                setPassword(""); // Rensa lösenordet efter uppdatering
            } else {
                setMessage("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setMessage("An error occurred while updating.");
        }
    };

    return (
        <ProtectedRoute>
            <div className="p-6">
                <h1 className="text-2xl font-bold">User Profile</h1>
                {message && <p className="text-green-600">{message}</p>}
                {user ? (
                    <div className="mt-4">
                        <h2>Update user information</h2>
                        <label className="block">Name:</label>
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            className="border p-2 rounded w-full"
                        />

                        <label className="block mt-2">Email:</label>
                        <input
                            type="email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                            className="border p-2 rounded w-full"
                        />

                        <label className="block mt-2">New Password (optional):</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded w-full"
                        />

                        <button
                            onClick={handleUpdate}
                            className="mt-4 bg-blue-600 text-white p-2 rounded"
                        >
                            Update Profile
                        </button>
                    </div>
                ) : (
                    <p>Loading user info...</p>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default User;
