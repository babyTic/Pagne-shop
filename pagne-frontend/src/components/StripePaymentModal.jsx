// src/components/StripePaymentModal.jsx
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// Charge Stripe avec la clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Style du champ carte
const CARD_STYLE = {
  style: {
    base: {
      color:           "#ffffff",
      fontFamily:      "DM Sans, sans-serif",
      fontSize:        "16px",
      "::placeholder": { color: "#52525b" },
    },
    invalid: { color: "#ef4444" },
  },
};

// Formulaire interne Stripe
function CheckoutForm({ order, onClose, onSuccess }) {
  const stripe   = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [secret,   setSecret]   = useState(null);

  // Récupère le client_secret au chargement
  useEffect(() => {
    API.post("/stripe/intent", { order_id: order.id })
      .then((res) => setSecret(res.data.client_secret))
      .catch(() => setError("Erreur initialisation paiement."));
  }, [order.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !secret) return;

    setError("");
    setLoading(true);

    // Confirme le paiement avec les infos carte
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      secret,
      { payment_method: { card: elements.getElement(CardElement) } }
    );

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // Notifie le backend
      await API.post("/stripe/confirm", {
        payment_intent_id: paymentIntent.id,
      });
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => navigate("/orders"), 2000);
    }

    setLoading(false);
  };

  // Succès
  if (success) return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-3xl">
        ✓
      </div>
      <p className="text-green-400 font-bold text-xl">Paiement réussi !</p>
      <p className="text-zinc-400 text-sm text-center">
        Votre commande est confirmée. Redirection...
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Montant */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex justify-between items-center">
        <span className="text-zinc-400 text-sm">Montant</span>
        <span className="text-orange-500 font-bold text-2xl"
          style={{fontFamily:"'Bebas Neue', sans-serif"}}>
          {Number(order.total_price).toLocaleString()} FCFA
        </span>
      </div>

      {/* Champ carte Stripe */}
      <div>
        <label className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">
          Informations carte
        </label>
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 focus-within:border-orange-500 transition">
          {secret ? (
            <CardElement options={CARD_STYLE} />
          ) : (
            <p className="text-zinc-500 text-sm animate-pulse">Chargement...</p>
          )}
        </div>
      </div>

      {/* Carte de test */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-400">
        🧪 <span className="font-semibold">Carte test :</span> 4242 4242 4242 4242
        — Date : 12/34 — CVC : 123
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 rounded-xl transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading || !stripe || !secret}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50 tracking-wide"
        >
          {loading ? "Paiement..." : "💳 PAYER"}
        </button>
      </div>

      <p className="text-zinc-600 text-xs text-center">
        🔒 Paiement sécurisé par Stripe
      </p>
    </form>
  );
}

// Modale principale avec wrapper Stripe
export default function StripePaymentModal({ order, onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative">

        {/* Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition text-xl"
        >✕</button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">
            💳
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Paiement par carte</h2>
            <p className="text-zinc-500 text-sm">Commande #{order.id}</p>
          </div>
        </div>

        {/* Stripe Elements wrapper */}
        <Elements stripe={stripePromise}>
          <CheckoutForm
            order={order}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}