"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthCheckerProps {
    setIsLoggedIn: (value: boolean) => void;
    setUsername: (value: string | null) => void;
}

const AuthChecker = ({ setIsLoggedIn, setUsername }: AuthCheckerProps) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            handleLogout();
            return;
        }

        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const isExpired = decoded.exp * 1000 < Date.now();

            if (isExpired) {
                handleLogout();
            }
        } catch (error) {
            console.error("Invalid token", error);
            handleLogout();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUsername(null);

        if (pathname === "/user") {
            router.push("/login");
        }
    };

    return null;
};

export default AuthChecker;
