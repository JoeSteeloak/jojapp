"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { UserInterface } from "@/app/types/UserInterface";
import UserReviews from "@/app/components/UserReviews";
import { UserPen } from "lucide-react";

const User = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserInterface | null>(null);
    const [userId, setUserId] = useState<string>(""); 
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Hämta användardata
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch("/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    console.error("Failed to fetch user data");
                    return;
                }

                const data: UserInterface = await res.json();
                setUser(data);
                setUserId(data._id);
                setUpdatedName(data.username);
                setUpdatedEmail(data.email);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword) {
            setMessage("You must enter your old password to update your info.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch("/api/users", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId, 
                    newUsername: updatedName,
                    newEmail: updatedEmail,
                    oldPassword,
                    newPassword: newPassword || undefined, 
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("User updated successfully!");
                setUser(data.user);
            } else {
                setMessage(data.message || "Failed to update user.");
            }
        } catch (error) {
            setMessage("Error updating user.");
            console.error("Error updating user:", error);
        }
    };

    return (
        <ProtectedRoute>
            <div className="bg-gray-100 min-h-screen py-12"> 
                <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md w-9/10"> 
                    <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">User Profile</h1>

                    {message && <p className="text-red-500 text-center mb-4">{message}</p>}

                    {user && (
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-600">Name</label>
                                <input
                                    type="text"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                    className="border border-gray-300 p-3 w-full rounded-md focus:ring-1 focus:ring-gray-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    value={updatedEmail}
                                    onChange={(e) => setUpdatedEmail(e.target.value)}
                                    className="border border-gray-300 p-3 w-full rounded-md focus:ring-1 focus:ring-gray-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-600">Old Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="border border-gray-300 p-3 w-full rounded-md focus:ring-1 focus:ring-gray-400"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-600">New Password (optional)</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="border border-gray-300 p-3 w-full rounded-md focus:ring-1 focus:ring-gray-400"
                                />
                            </div>

                            <div className="mt-4 text-center">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                                >
                                    <UserPen className="inline-block mr-2" size={18} />
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                {userId && <UserReviews userId={userId} />}
            </div>
        </ProtectedRoute>
    );
};

export default User;
