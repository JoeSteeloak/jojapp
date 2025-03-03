"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <ul className="flex gap-4">
                <li>
                    <Link href="/" className={pathname === "/" ? "font-bold" : ""}>Home</Link>
                </li>
                <li>
                    <Link href="/search" className={pathname === "/search" ? "font-bold" : ""}>Search</Link>
                </li>
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

