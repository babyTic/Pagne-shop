import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate         = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 style={{fontFamily:"'Bebas Neue', sans-serif"}}
        className="text-5xl text-white mb-8 tracking-wide">
        MON PROFIL
      </h1>

      {/* Carte principale */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">

        {/* Bandeau */}
        <div className="h-24 bg-gradient-to-r from-orange-500/30 via-orange-500/10 to-transparent relative">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/0 to-zinc-900/50" />
        </div>

        <div className="px-6 pb-6 -mt-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-orange-500 border-4 border-zinc-900 flex items-center justify-center text-3xl font-bold text-black mb-4"
            style={{fontFamily:"'Bebas Neue', sans-serif"}}>
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>

          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              user?.role === "admin"
                ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                : "bg-green-500/10 text-green-400 border-green-500/30"
            }`}>
              {user?.role === "admin" ? "👑 Admin" : "🛍️ Client"}
            </span>
          </div>
          <p className="text-zinc-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Infos */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Nom",           value: user?.name                                                                    },
          { label: "Email",         value: user?.email                                                                   },
          { label: "Rôle",          value: user?.role                                                                    },
          { label: "Membre depuis", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-white font-medium capitalize">{value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-xl transition tracking-wide"
          >
            🛠️ DASHBOARD
          </button>
        )}
        <button
          onClick={() => navigate("/orders")}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-xl transition"
        >
          📦 Mes commandes
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold py-3 rounded-xl transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}