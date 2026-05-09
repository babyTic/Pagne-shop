// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar";
import FloatingChat from "../components/FloatingChat"; // ✅ import

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <FloatingChat /> {/* ✅ présent sur toutes les pages */}
    </div>
  );
}