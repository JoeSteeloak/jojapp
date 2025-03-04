"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { UserInterface } from "@/app/types/UserInterface";
import UserReviews from "@/app/components/UserReviews";

const User = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserInterface | null>(null);
    const [userId, setUserId] = useState<string>(""); // Lagra userId separat
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
                setUserId(data._id); // Spara userId från backend
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
                    userId, // Skicka med användarens ID
                    newUsername: updatedName,
                    newEmail: updatedEmail,
                    oldPassword,
                    newPassword: newPassword || undefined, // Endast skicka om det finns
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
            <div className="p-6">
                <h1 className="text-2xl font-bold">User Profile</h1>
                {message && <p className="text-red-500">{message}</p>}
                {user && (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={updatedEmail}
                                onChange={(e) => setUpdatedEmail(e.target.value)}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div>
                            <label>Old Password (required for updates)</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="border p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label>New Password (optional)</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="border p-2 w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded"
                        >
                            Update Profile
                        </button>
                    </form>
                )}
            </div>
            {userId && <UserReviews userId={userId} />}
        </ProtectedRoute>
    );
};

export default User;
