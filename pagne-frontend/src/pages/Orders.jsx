import { useEffect, useState } from "react";
import API from "../services/api";

const STATUT_STYLES = {
  "en attente" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "confirmée"  : "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "expédiée"   : "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "livrée"     : "bg-green-500/10 text-green-400 border-green-500/20",
  "annulée"    : "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    API.get("/my-orders")
      .then((res) => setOrders(res.data.data ?? res.data))
      .catch(() => setError("Impossible de charger vos commandes."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="flex gap-2">
        {[0,150,300].map((d) => (
          <span key={d} className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
            style={{animationDelay:`${d}ms`}} />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-400 mt-10 bg-red-500/10 border border-red-500/20 rounded-xl p-6">{error}</div>
  );

  return (
    <div>
      <h1 style={{fontFamily:"'Bebas Neue', sans-serif"}}
        className="text-5xl text-white mb-8 tracking-wide">
        MES COMMANDES
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-zinc-400 text-lg">Aucune commande pour le moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition">

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-zinc-500 text-sm">#{order.id}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400 text-sm">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  STATUT_STYLES[order.status] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}>
                  {order.status}
                </span>
              </div>

              {order.items?.map((item) => (
                <div key={item.id}
                  className="flex justify-between text-sm text-zinc-400 py-2 border-b border-zinc-800 last:border-0">
                  <span>{item.product?.name ?? "Produit"} <span className="text-zinc-600">×{item.quantity}</span></span>
                  <span className="text-white">{Number(item.price * item.quantity).toLocaleString()} FCFA</span>
                </div>
              ))}

              <div className="flex justify-between items-center mt-4 pt-2">
                <span className="text-zinc-500 text-sm">Total</span>
                <span style={{fontFamily:"'Bebas Neue', sans-serif"}}
                  className="text-orange-500 text-2xl">
                  {Number(order.total_price).toLocaleString()} FCFA
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}