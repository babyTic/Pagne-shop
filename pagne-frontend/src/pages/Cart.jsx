// src/pages/Cart.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import API from "../services/api";
import StripePaymentModal from "../components/StripePaymentModal";
import PaymentModal from "../components/PaymentModal";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [loading,       setLoading]       = useState(false);
  const [paymentOrder,  setPaymentOrder]  = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
  try {
    setLoading(true);
    const res = await API.post("/orders", {
      //  "products" au lieu de "items"
      //  "id" au lieu de "product_id"
      products: cart.map((item) => ({
        id:       item.id,
        quantity: item.quantity,
      })),
    });
    const order = res.data.order ?? res.data; // ✅ le backend retourne "order" pas "data"
    clearCart();
    setPaymentOrder(order);
  } catch (err) {
  console.error("ERREUR COMPLÈTE :", err);
  console.error("RESPONSE :", err.response?.data);
  console.error("STATUS :", err.response?.status);
  alert(JSON.stringify(err.response?.data ?? err.message));
} finally {
    setLoading(false);
  }
};
  // ── Panier vide ──
  if (cart.length === 0 && !paymentOrder) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <div className="text-7xl">🛒</div>
      <p className="text-xl font-semibold text-zinc-300">Votre panier est vide</p>
      <button
        onClick={() => navigate("/")}
        className="mt-2 bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2.5 rounded-full text-sm transition"
      >
        VOIR LES PAGNES
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── MODALE CHOIX PAIEMENT ── */}
      {paymentOrder && !paymentMethod && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-white font-bold text-xl mb-2">Choisir le paiement</h2>
            <p className="text-zinc-500 text-sm mb-6">
              Commande #{paymentOrder.id} —{" "}
              <span className="text-orange-500 font-bold">
                {Number(paymentOrder.total_price).toLocaleString()} FCFA
              </span>
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setPaymentMethod("stripe")}
                className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500/50 text-white font-semibold py-4 rounded-xl transition flex items-center gap-4 px-5"
              >
                <span className="text-2xl">💳</span>
                <div className="text-left">
                  <p className="font-bold">Carte bancaire</p>
                  <p className="text-zinc-500 text-xs">Visa, Mastercard — via Stripe</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("cinetpay")}
                className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500/50 text-white font-semibold py-4 rounded-xl transition flex items-center gap-4 px-5"
              >
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <p className="font-bold">Mobile Money</p>
                  <p className="text-zinc-500 text-xs">Orange, MTN, Moov — via CinetPay</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentOrder(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm text-center transition mt-2"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALE STRIPE ── */}
      {paymentOrder && paymentMethod === "stripe" && (
        <StripePaymentModal
          order={paymentOrder}
          onClose={() => { setPaymentOrder(null); setPaymentMethod(null); navigate("/orders"); }}
          onSuccess={() => setTimeout(() => navigate("/orders"), 2000)}
        />
      )}

      {/* ── MODALE CINETPAY ── */}
      {paymentOrder && paymentMethod === "cinetpay" && (
        <PaymentModal
          order={paymentOrder}
          onClose={() => { setPaymentOrder(null); setPaymentMethod(null); navigate("/orders"); }}
          onSuccess={() => setTimeout(() => navigate("/orders"), 2000)}
        />
      )}

      <h1 style={{fontFamily:"'Bebas Neue', sans-serif"}}
        className="text-5xl text-white mb-8 tracking-wide">
        MON PANIER
        <span className="text-orange-500 ml-3 text-3xl">({cart.length})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Liste articles */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {cart.map((item) => (
            <div key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:border-zinc-700 transition"
            >
              {item.image ? (
                <img src={item.image} alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl flex-shrink-0">🪡</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{item.name}</p>
                <p className="text-orange-500 text-sm font-bold">
                  {Number(item.price).toLocaleString()} FCFA
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition disabled:opacity-30"
                >−</button>
                <span className="w-6 text-center text-white font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition"
                >+</button>
              </div>
              <p className="text-white font-bold text-sm w-24 text-right">
                {Number(item.price * item.quantity).toLocaleString()} FCFA
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-zinc-600 hover:text-red-400 transition ml-2"
              >✕</button>
            </div>
          ))}
        </div>

        {/* Récapitulatif */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="text-white font-bold text-lg mb-6 pb-4 border-b border-zinc-800">
            Récapitulatif
          </h2>
          <div className="flex justify-between text-zinc-400 text-sm mb-3">
            <span>Sous-total</span>
            <span>{Number(total).toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-sm mb-6">
            <span>Livraison</span>
            <span className="text-green-400">Gratuite</span>
          </div>
          <div className="flex justify-between text-white font-bold text-xl mb-6 pt-4 border-t border-zinc-800">
            <span>Total</span>
            <span className="text-orange-500">{Number(total).toLocaleString()} FCFA</span>
          </div>
          <button
            onClick={handleOrder}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50 tracking-wide"
          >
            {loading ? "COMMANDE EN COURS..." : "✓ COMMANDER"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-3 text-zinc-500 hover:text-zinc-300 text-sm text-center transition"
          >
            ← Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
}