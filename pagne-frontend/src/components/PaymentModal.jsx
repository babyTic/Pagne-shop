// src/components/PaymentModal.jsx
// Modale de paiement CinetPay — s'ouvre avant de confirmer la commande

import { useState } from "react";
import API from "../services/api";

export default function PaymentModal({ order, onClose, onSuccess }) {
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(false);
  const [status,   setStatus]   = useState(null);
  const [txId,     setTxId]     = useState(null);
  const [error,    setError]    = useState("");

  // Étape 1 — Lance le paiement → redirige vers CinetPay
  const handlePay = async () => {
    setError("");
    try {
      setLoading(true);
      const res = await API.post("/payment/initiate", { order_id: order.id });
      const { payment_url, transaction_id } = res.data;
      setTxId(transaction_id);

      // Ouvre CinetPay dans un nouvel onglet
      window.open(payment_url, "_blank");

      // Après l'ouverture, propose de vérifier le statut
      setLoading(false);
      setStatus("pending");
    } catch (err) {
      setError(err.response?.data?.message ?? "Erreur lors de l'initialisation.");
      setLoading(false);
    }
  };

  // Étape 2 — Vérifie si le paiement est confirmé
  const handleCheck = async () => {
    if (!txId) return;
    try {
      setChecking(true);
      const res = await API.post("/payment/check", { transaction_id: txId });
      setStatus(res.data.paid ? "success" : "pending");
      if (res.data.paid) onSuccess?.();
    } catch {
      setError("Impossible de vérifier le paiement.");
    } finally {
      setChecking(false);
    }
  };

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
            <h2 className="text-white font-bold text-lg">Paiement sécurisé</h2>
            <p className="text-zinc-500 text-sm">Commande #{order.id}</p>
          </div>
        </div>

        {/* Montant */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-6 flex justify-between items-center">
          <span className="text-zinc-400 text-sm">Montant à payer</span>
          <span className="text-orange-500 font-bold text-2xl"
            style={{fontFamily:"'Bebas Neue', sans-serif"}}>
            {Number(order.total_price).toLocaleString()} FCFA
          </span>
        </div>

        {/* Méthodes disponibles */}
        <div className="mb-6">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
            Méthodes acceptées
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Orange Money", icon: "🟠" },
              { label: "MTN MoMo",     icon: "🟡" },
              { label: "Moov Money",   icon: "🔵" },
            ].map(({ label, icon }) => (
              <div key={label}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center">
                <span className="text-2xl block mb-1">{icon}</span>
                <span className="text-zinc-400 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Étapes de paiement */}
        {status === null && (
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50 tracking-wide"
          >
            {loading ? "Initialisation..." : "💳 PAYER MAINTENANT"}
          </button>
        )}

        {status === "pending" && (
          <div className="flex flex-col gap-3">
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm px-4 py-3 rounded-xl text-center">
              ⏳ Complétez le paiement dans l'onglet ouvert, puis vérifiez ici.
            </div>
            <button
              onClick={handleCheck}
              disabled={checking}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {checking ? "Vérification..." : "🔍 Vérifier mon paiement"}
            </button>
            <button
              onClick={handlePay}
              className="w-full text-zinc-500 hover:text-zinc-300 text-sm transition text-center"
            >
              ↩️ Relancer le paiement
            </button>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-3xl">
              ✓
            </div>
            <p className="text-green-400 font-bold text-lg">Paiement confirmé !</p>
            <p className="text-zinc-500 text-sm text-center">
              Votre commande est en cours de traitement.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl transition"
            >
              VOIR MES COMMANDES
            </button>
          </div>
        )}

        {/* Sécurité */}
        <p className="text-zinc-600 text-xs text-center mt-4">
          🔒 Paiement sécurisé par CinetPay
        </p>
      </div>
    </div>
  );
}