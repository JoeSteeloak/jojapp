"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login"); 
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
};

export default ProtectedRoute;
