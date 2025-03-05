"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle state for the mobile menu

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
                        setUsername(data.username); // Set username from API response
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
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-4 mr-20">
                    <Link href="/" className="font-bold text-xl text-white">MyBookReviews</Link>
                </div>

                {/* Stor skärm */}
                <div className="hidden lg:flex gap-8 items-center">
                    <Link href="/" className={`font-medium ${pathname === "/" ? "text-yellow-400" : "text-white"} hover:text-yellow-400 transition-colors duration-300`}>Home</Link>
                    <Link href="/search" className={`font-medium ${pathname === "/search" ? "text-yellow-400" : "text-white"} hover:text-yellow-400 transition-colors duration-300`}>Search</Link>

                    {/* User för inloggade */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-4 ml-auto">
                            <Link 
                                href="/user" 
                                className={`font-medium ${pathname === "/user" ? "text-yellow-400" : "text-white"} hover:text-yellow-400 transition-colors duration-300`}
                            >
                                User
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link 
                            href="/login" 
                            className={`font-medium ${pathname === "/login" ? "text-yellow-400" : "text-white"} hover:text-yellow-400 transition-colors duration-300`}
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Hamburgar knapp */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden flex items-center justify-center text-white ml-auto"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Mobil meny */}
            <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} bg-blue-600 p-4 mt-2`}>
                <div className="flex flex-col gap-4">
                    <Link href="/" className={`font-medium ${pathname === "/" ? "text-yellow-400" : "text-white"} hover:text-yellow-400 transition-colors duration-300`}>Home</Link>
                    <Link href="/search" className={`font-medium ${pathname === "/search" ? "text-yellow-400" : "text-white"} hover:text-yellow-400 transition-colors duration-300`}>Search</Link>

                    {/* User för inloggade på små */}
                    {isLoggedIn ? (
                        <>
                            <Link href="/user" className={`font-medium ${pathname === "/user" ? "text-yellow-400" : "text-white"} hover:text-yellow-400 transition-colors duration-300`}>User</Link>
                            <div className="text-gray-900 mb-2">Logged in as: {username}</div>
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-500 text-white font-medium py-2 px-4 rounded-md max-w-40 w-auto hover:bg-red-600 transition-colors duration-300 cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link 
                            href="/login" 
                            className={`font-medium ${pathname === "/login" ? "text-yellow-400" : "text-white"} hover:text-yellow-400 transition-colors duration-300 cursor-pointer`}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;







