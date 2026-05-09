import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login }               = useContext(AuthContext);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const loggedUser = await login(email, password);
      loggedUser.role === "admin" ? navigate("/admin") : navigate("/");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">

      {/* Panneau gauche — déco */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-red-600/10" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p style={{fontFamily:"'Bebas Neue', sans-serif"}}
            className="text-8xl text-white/10 tracking-widest leading-none">
            PAGNE<br/>SHOP
          </p>
          <div className="mt-6 w-16 h-1 bg-orange-500 mx-auto" />
          <p className="text-zinc-400 mt-4 text-sm tracking-widest uppercase">
            L'authenticité africaine
          </p>
        </div>
        {/* Cercles décoratifs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-orange-500/10" />
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full border border-orange-500/20" />
        <div className="absolute top-40 left-10 w-3 h-3 bg-orange-500 rounded-full" />
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-orange-500 rounded-full" />
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <span style={{fontFamily:"'Bebas Neue', sans-serif"}}
              className="text-4xl text-white tracking-widest">
              PAGNE<span className="text-orange-500">SHOP</span>
            </span>
            <h1 className="text-2xl font-light text-zinc-300 mt-2">Bon retour 👋</h1>
            <p className="text-zinc-500 text-sm mt-1">Connecte-toi pour accéder à la boutique</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition placeholder-zinc-600"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition placeholder-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50 tracking-wide"
            >
              {loading ? "Connexion..." : "SE CONNECTER"}
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Pas de compte ?{" "}
            <a href="/register" className="text-orange-500 hover:text-orange-400 font-medium">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}