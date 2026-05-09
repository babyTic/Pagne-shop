// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // ✅ Attend que le contexte soit prêt avant de rediriger
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-amber-600 animate-pulse text-lg">Chargement...</p>
    </div>
  );

  return user ? children : <Navigate to="/login" replace />;
}