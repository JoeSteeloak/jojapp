"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);

            // Hämta användardata från API med JWT-token
            fetch("/api/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.username) {
                        setUsername(data.username); // Sätt användarnamnet från API-svaret
                    }
                })
                .catch((error) => console.error("Failed to fetch user data:", error));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUsername(null);
        router.push("/login");
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <ul className="flex gap-4 justify-between w-full">
                <div className="flex gap-4">
                    <li>
                        <Link href="/" className={pathname === "/" ? "font-bold" : ""}>Home</Link>
                    </li>
                    <li>
                        <Link href="/search" className={pathname === "/search" ? "font-bold" : ""}>Search</Link>
                    </li>
                </div>
                {isLoggedIn ? (
                    <>
                        <li>
                            <Link href="/user" className={pathname === "/user" ? "font-bold" : ""}>User</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
                                Logout
                            </button>
                        </li>
                        <li className="ml-auto">
                            <span>You are logged in as {username}</span>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link href="/login" className={pathname === "/login" ? "font-bold" : ""}>Login</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
