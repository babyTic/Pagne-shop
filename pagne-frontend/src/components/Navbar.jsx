import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-orange-500 text-2xl">✦</span>
          <span style={{fontFamily:"'Bebas Neue', sans-serif"}}
            className="text-white text-2xl tracking-widest">
            PAGNE<span className="text-orange-500">SHOP</span>
          </span>
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: "/",       label: "Boutique" },
            { to: "/orders", label: "Commandes" },
            { to: "/cart",   label: "Panier 🛒" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-zinc-400 hover:text-orange-500 transition text-sm font-medium tracking-wide"
            >
              {label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-orange-500 hover:text-orange-400 text-sm font-semibold tracking-wide border border-orange-500/30 px-3 py-1 rounded-full hover:border-orange-400 transition"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Droite */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/profile"
            className="text-zinc-400 hover:text-white transition text-sm"
          >
            👤 {user?.name}
          </Link>
          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-4 py-2 rounded-full text-sm transition"
          >
            Déconnexion
          </button>
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden text-zinc-400 hover:text-white text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-4 flex flex-col gap-4">
          <Link to="/"       onClick={() => setMenuOpen(false)} className="text-zinc-300 hover:text-orange-500 transition">Boutique</Link>
          <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-zinc-300 hover:text-orange-500 transition">Commandes</Link>
          <Link to="/cart"   onClick={() => setMenuOpen(false)} className="text-zinc-300 hover:text-orange-500 transition">🛒 Panier</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-zinc-300 hover:text-orange-500 transition">👤 Profil</Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-orange-500 font-semibold">Dashboard</Link>
          )}
          <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 transition font-medium">
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
}