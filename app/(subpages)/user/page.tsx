import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const User = () => {
    return (
    <ProtectedRoute>
        <h1>Testar protected route</h1>
    </ProtectedRoute>
    );
};

export default User;