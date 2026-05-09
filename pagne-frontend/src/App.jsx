import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Products   from "./pages/Products";
import Cart       from "./pages/Cart";
import Orders     from "./pages/Orders";
import Dashboard  from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute     from "./components/AdminRoute";
import MainLayout     from "./layouts/MainLayout";
import Profile from "./pages/Profile"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Routes PUBLIQUES ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* ✅ public + Register majuscule */}

        {/* ── Routes CLIENT protégées ── */}
        <Route path="/profile" element={
          <ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute><MainLayout><Products /></MainLayout></ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute><MainLayout><Cart /></MainLayout></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>
        } />

        {/* ── Route ADMIN protégée ── */}
        <Route path="/admin" element={
          <AdminRoute><MainLayout><Dashboard /></MainLayout></AdminRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;