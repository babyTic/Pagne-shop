import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const { addToCart }           = useContext(CartContext);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.data ?? res.data))
      .catch(() => setError("Impossible de charger les produits."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="flex gap-2">
        <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
        <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
        <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-400 mt-10 bg-red-500/10 border border-red-500/20 rounded-xl p-6">
      {error}
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <div className="relative mb-12 py-16 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-600/5" />
        <div className="absolute top-8 right-8 w-32 h-32 rounded-full border border-orange-500/10" />
        <div className="absolute bottom-4 left-8 w-3 h-3 bg-orange-500 rounded-full" />
        <div className="relative z-10 px-8">
          <p className="text-orange-500 text-xs uppercase tracking-widest mb-3 font-medium">
            Collection exclusive
          </p>
          <h1 style={{fontFamily:"'Bebas Neue', sans-serif"}}
            className="text-6xl md:text-8xl text-white leading-none mb-4">
            NOS PAGNES
          </h1>
          <p className="text-zinc-400 max-w-md">
            Découvrez notre sélection de tissus africains authentiques, wax, kita, bogolan et bazin.
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un pagne..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-full pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition placeholder-zinc-600 text-sm"
          />
        </div>
        <span className="text-zinc-500 text-sm">{filtered.length} produit{filtered.length > 1 ? "s" : ""}</span>
      </div>

      {/* Aucun résultat */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🪡</p>
          <p className="text-zinc-400 text-lg">Aucun produit trouvé.</p>
        </div>
      )}

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
          >
            {/* Image */}
            <div className="relative overflow-hidden h-52">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-5xl">
                  🪡
                </div>
              )}
              {/* Badge catégorie */}
              <span className="absolute top-3 right-3 bg-black/70 backdrop-blur text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/30">
                {product.category?.name ?? "—"}
              </span>
              {/* Badge stock faible */}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="absolute top-3 left-3 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
                  Plus que {product.stock} !
                </span>
              )}
            </div>

            {/* Infos */}
            <div className="p-5">
              <h2 className="text-white font-semibold text-lg mb-1 truncate">{product.name}</h2>
              <p className="text-zinc-500 text-sm mb-4 line-clamp-2">
                {product.description ?? "Aucune description."}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span style={{fontFamily:"'Bebas Neue', sans-serif"}}
                  className="text-2xl text-orange-500">
                  {Number(product.price).toLocaleString()} FCFA
                </span>
                <span className="text-zinc-600 text-xs">Stock : {product.stock}</span>
              </div>

              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold py-2.5 rounded-xl transition text-sm tracking-wide disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? "RUPTURE DE STOCK" : "🛒 AJOUTER AU PANIER"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}