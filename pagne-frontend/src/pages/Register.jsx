import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm]       = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const navigate              = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      setLoading(true);
      await API.post("/register", form);
      navigate("/login");
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { general: ["Erreur lors de l'inscription."] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <span style={{fontFamily:"'Bebas Neue', sans-serif"}}
            className="text-4xl text-white tracking-widest">
            PAGNE<span className="text-orange-500">SHOP</span>
          </span>
          <h1 className="text-2xl font-light text-zinc-300 mt-2">Créer un compte</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {errors.general[0]}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: "name",                  label: "Nom complet",           type: "text",     placeholder: "Jean Dupont"         },
              { name: "email",                 label: "Email",                  type: "email",    placeholder: "ton@email.com"       },
              { name: "password",              label: "Mot de passe",           type: "password", placeholder: "••••••••"            },
              { name: "password_confirmation", label: "Confirmer mot de passe", type: "password", placeholder: "••••••••"            },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">{label}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition placeholder-zinc-600"
                />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name][0]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50 tracking-wide"
            >
              {loading ? "Inscription..." : "CRÉER MON COMPTE"}
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Déjà un compte ?{" "}
            <a href="/login" className="text-orange-500 hover:text-orange-400 font-medium">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
}