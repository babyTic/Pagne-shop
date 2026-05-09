// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-amber-600 animate-pulse">Chargement...</p>
    </div>
  );

  if (!user)                return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}