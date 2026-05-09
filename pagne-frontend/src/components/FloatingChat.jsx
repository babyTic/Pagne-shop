// src/components/FloatingChat.jsx
import { useState, useRef, useEffect } from "react";

const getAutoReply = (question) => {
  const q = question.toLowerCase();

  if (q.match(/livr|délai|temps|quand|combien de jour/))
    return "📦 Livraison standard sous 3 à 5 jours ouvrables. Express disponible en 24-48h moyennant un supplément.";
  if (q.match(/retour|rembours|échange|renvoyer/))
    return "↩️ Les retours sont acceptés sous 7 jours après réception, si l'article n'a pas été porté.";
  if (q.match(/paiement|payer|moyen|mobile money|stripe|carte/))
    return "💳 Nous acceptons le Mobile Money via CinetPay et les cartes bancaires via Stripe. Paiement 100% sécurisé.";
  if (q.match(/wax|entretien|laver|lavage|nettoyer/))
    return "🧺 Le Wax se lave à 30°C en machine. Le Bogolan se lave à la main uniquement.";
  if (q.match(/taille|dimension|mesure|mètre/))
    return "📏 Nos pagnes sont vendus en coupons de 6 yards (5,5m). Idéal pour 2 tenues complètes.";
  if (q.match(/prix|coût|combien|tarif|fcfa/))
    return "💰 Nos prix vont de 7 500 à 25 000 FCFA selon le type de tissu.";
  if (q.match(/bogolan|kita|bazin|authentique/))
    return "🌍 Tous nos tissus sont sourcés directement auprès d'artisans africains.";
  if (q.match(/stock|disponible|rupture/))
    return "✅ La disponibilité est indiquée sur chaque article dans la boutique.";
  if (q.match(/contact|email|téléphone|joindre/))
    return "📩 Contactez-nous à contact@pagneshop.com. Réponse sous 24h.";
  if (q.match(/bonjour|salut|hello|bonsoir/))
    return "👋 Bonjour ! Bienvenue sur PagneShop. Comment puis-je vous aider ?";
  if (q.match(/merci|super|parfait|nickel/))
    return "😊 Avec plaisir ! N'hésitez pas si vous avez d'autres questions.";

  return "🤔 Je n'ai pas bien compris. Vous pouvez me demander : les délais de livraison, l'entretien des tissus, les moyens de paiement ou les retours.";
};

export default function FloatingChat() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Bonjour ! Je suis l'assistant PagneShop. Comment puis-je vous aider ?" }
  ]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [pos,      setPos]      = useState({ x: window.innerWidth - 90, y: window.innerHeight - 90 });

  const dragging      = useRef(false);
  const offset        = useRef({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMouseDown = (e) => {
    if (open) return;
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 64, e.clientX - offset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 64, e.clientY - offset.current.y)),
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    const reply = getAutoReply(userMessage.content);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SUGGESTIONS = [
    "Délai de livraison ?",
    "Comment laver le wax ?",
    "Politique de retour ?",
    "Paiement disponible ?",
  ];

  return (
    <>
      {/* Bouton flottant */}
      <div
        onMouseDown={handleMouseDown}
        onClick={() => setOpen((o) => !o)}
        style={{ left: pos.x, top: pos.y, position: "fixed", zIndex: 50 }}
        className="cursor-pointer select-none"
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          open ? "bg-zinc-800 border border-zinc-700" : "bg-orange-500 hover:bg-orange-600 hover:scale-110"
        }`}>
          <span className="text-2xl">{open ? "✕" : "💬"}</span>
        </div>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-zinc-950 animate-pulse" />
        )}
      </div>

      {/* Fenêtre chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            left: Math.min(pos.x, window.innerWidth - 384),
            top:  Math.max(0, pos.y - 480),
            zIndex: 51,
          }}
          className="w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-zinc-800 px-4 py-3 flex items-center gap-3 border-b border-zinc-700">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-lg">🪡</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Assistant PagneShop</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs">En ligne</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMessages([{ role: "assistant", content: "👋 Bonjour ! Je suis l'assistant PagneShop. Comment puis-je vous aider ?" }]);
              }}
              className="text-zinc-500 hover:text-zinc-300 text-xs transition"
            >🔄</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-72">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">
                    🪡
                  </div>
                )}
                <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-orange-500 text-black font-medium rounded-br-sm"
                    : "bg-zinc-800 text-zinc-200 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-sm mr-2 flex-shrink-0">🪡</div>
                <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={(e) => { e.stopPropagation(); setInput(s); }}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700 hover:border-orange-500/50 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-zinc-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              disabled={loading}
              className="flex-1 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 transition placeholder-zinc-600 disabled:opacity-50"
            />
            <button
              onClick={(e) => { e.stopPropagation(); sendMessage(); }}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 rounded-xl flex items-center justify-center transition flex-shrink-0"
            >
              <span className="text-black font-bold text-sm">➤</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}