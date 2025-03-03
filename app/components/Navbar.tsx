"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-blue-600 text-white p-4">
            <ul className="flex gap-4">
                <li>
                    <Link href="/" className={pathname === "/" ? "font-bold" : ""}>Home</Link>
                </li>
                <li>
                    <Link href="/search" className={pathname === "/search" ? "font-bold" : ""}>Search</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
