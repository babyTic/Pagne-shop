// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";

const STATUTS = ["en attente", "confirmée", "expédiée", "livrée", "annulée"];

const STATUT_COLORS = {
  "en attente" : "bg-yellow-100 text-yellow-700",
  "confirmée"  : "bg-blue-100 text-blue-700",
  "expédiée"   : "bg-purple-100 text-purple-700",
  "livrée"     : "bg-green-100 text-green-700",
  "annulée"    : "bg-red-100 text-red-600",
};

export default function Dashboard() {
  const [products,    setProducts]    = useState([]);
  const [orders,      setOrders]      = useState([]);
  const [loadingP,    setLoadingP]    = useState(true);
  const [loadingO,    setLoadingO]    = useState(true);
  const [activeTab,   setActiveTab]   = useState("stats");

  // --- États ajout produit ---
  const [form,        setForm]        = useState({ name: "", description: "", price: "", stock: "", category_id: "", image: null });
  const [formLoading, setFormLoading] = useState(false);
  const [formError,   setFormError]   = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // --- États édition produit ---
  const [editProduct, setEditProduct] = useState(null);
  const [editForm,    setEditForm]    = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError,   setEditError]   = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Chargement produits
  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.data ?? res.data))
      .finally(() => setLoadingP(false));
  }, []);

  // Chargement commandes
  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data.data ?? res.data))
      .finally(() => setLoadingO(false));
  }, []);

  // ── Stats ──
  const totalRevenu    = orders
    .filter((o) => o.status === "livrée")
    .reduce((sum, o) => sum + Number(o.total_price), 0);
  const totalCommandes = orders.length;
  const totalProduits  = products.length;
  const stockFaible    = products.filter((p) => p.stock <= 5).length;

  const repartitionStatuts = STATUTS.map((s) => ({
    statut: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  const topProduits = (() => {
    const counts = {};
    orders.forEach((o) => {
      o.items?.forEach((item) => {
        const nom = item.product?.name ?? `Produit #${item.product_id}`;
        counts[nom] = (counts[nom] ?? 0) + item.quantity;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  })();

  // ── Ajout produit avec image ──
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      setFormLoading(true);
      const formData = new FormData();
      formData.append("name",        form.name);
      formData.append("description", form.description);
      formData.append("price",       form.price);
      formData.append("stock",       form.stock);
      formData.append("category_id", form.category_id);
      if (form.image) formData.append("image", form.image);

      const res = await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts((prev) => [...prev, res.data.data ?? res.data]);
      setForm({ name: "", description: "", price: "", stock: "", category_id: "", image: null });
      setFormSuccess("Produit ajouté avec succès !");
    } catch (err) {
      setFormError(err.response?.data?.message ?? "Erreur lors de l'ajout.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Suppression produit ──
  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await API.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Ouvre modale édition ──
  const handleEditOpen = (product) => {
    setEditProduct(product);
    setEditForm({
      name:        product.name,
      description: product.description ?? "",
      price:       product.price,
      stock:       product.stock,
      category_id: product.category_id ?? "",
      image:       null, // nouvelle image seulement si l'admin en choisit une
    });
    setEditError("");
    setEditSuccess("");
  };

  // ── Soumet édition avec image ──
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append("_method",      "PUT");
      formData.append("name",         editForm.name);
      formData.append("description",  editForm.description);
      formData.append("price",        editForm.price);
      formData.append("stock",        editForm.stock);
      formData.append("category_id",  editForm.category_id);
      if (editForm.image instanceof File) formData.append("image", editForm.image);

      const res = await API.post(`/products/${editProduct.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data.data ?? res.data;
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditSuccess("Produit modifié avec succès !");
      setTimeout(() => setEditProduct(null), 1500);
    } catch (err) {
      setEditError(err.response?.data?.message ?? "Erreur lors de la modification.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Mise à jour statut commande ──
  const handleStatusChange = async (orderId, status) => {
    await API.put(`/orders/${orderId}/status`, { status });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const TABS = [
    { key: "stats",     label: "📊 Stats"     },
    { key: "produits",  label: "🪡 Produits"  },
    { key: "commandes", label: "📦 Commandes" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold text-amber-900 mb-6">🛠️ Dashboard Admin</h1>

      {/* Onglets */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === tab.key
                ? "bg-amber-700 text-white"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ONGLET STATS ── */}
      {activeTab === "stats" && (
        <div className="flex flex-col gap-8">

          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Revenu total", value: `${Number(totalRevenu).toLocaleString()} FCFA`, icon: "💰", color: "bg-green-50 border-green-200"  },
              { label: "Commandes",    value: totalCommandes,                                  icon: "📦", color: "bg-blue-50 border-blue-200"    },
              { label: "Produits",     value: totalProduits,                                   icon: "🪡", color: "bg-amber-50 border-amber-200"  },
              { label: "Stock faible", value: stockFaible,                                     icon: "⚠️", color: "bg-red-50 border-red-200"      },
            ].map((kpi) => (
              <div key={kpi.label} className={`rounded-2xl border p-5 ${kpi.color}`}>
                <p className="text-3xl mb-2">{kpi.icon}</p>
                <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
                <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Répartition par statut */}
            <div className="bg-white rounded-2xl shadow p-6 border border-amber-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Commandes par statut</h2>
              {loadingO ? (
                <p className="text-amber-600 animate-pulse">Chargement...</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {repartitionStatuts.map(({ statut, count }) => (
                    <div key={statut}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_COLORS[statut]}`}>
                          {statut}
                        </span>
                        <span className="font-bold text-gray-700">
                          {count} commande{count > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all"
                          style={{ width: totalCommandes > 0 ? `${(count / totalCommandes) * 100}%` : "0%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top 5 produits */}
            <div className="bg-white rounded-2xl shadow p-6 border border-amber-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 Top 5 produits commandés</h2>
              {loadingO ? (
                <p className="text-amber-600 animate-pulse">Chargement...</p>
              ) : topProduits.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucune commande pour le moment.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {topProduits.map(([nom, qty], index) => (
                    <div key={nom} className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        index === 0 ? "bg-yellow-400 text-white"   :
                        index === 1 ? "bg-gray-300 text-gray-700"  :
                        index === 2 ? "bg-amber-600 text-white"    :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 truncate">{nom}</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-amber-500 h-1.5 rounded-full"
                            style={{ width: `${(qty / topProduits[0][1]) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-amber-700 flex-shrink-0">×{qty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stock faible */}
          {stockFaible > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-red-700 mb-4">⚠️ Produits en stock faible (≤ 5)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.filter((p) => p.stock <= 5).map((p) => (
                  <div key={p.id} className="bg-white rounded-xl p-3 border border-red-100">
                    <p className="font-semibold text-gray-700 text-sm truncate">{p.name}</p>
                    <p className="text-red-500 font-bold text-lg">{p.stock} restant{p.stock > 1 ? "s" : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ONGLET PRODUITS ── */}
      {activeTab === "produits" && (
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Formulaire ajout */}
          <div className="bg-white rounded-2xl shadow p-6 border border-amber-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Ajouter un produit</h2>
            {formError   && <p className="text-red-600 text-sm mb-3">{formError}</p>}
            {formSuccess && <p className="text-green-600 text-sm mb-3">{formSuccess}</p>}

            <form onSubmit={handleAddProduct} className="flex flex-col gap-3">
              {[
                { key: "name",        placeholder: "Nom du produit", type: "text"   },
                { key: "price",       placeholder: "Prix (FCFA)",    type: "number" },
                { key: "stock",       placeholder: "Stock",          type: "number" },
                { key: "category_id", placeholder: "ID Catégorie",   type: "number" },
              ].map(({ key, placeholder, type }) => (
                <input
                  key={key}
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              ))}
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                rows={3}
              />

              {/* Champ image */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Image du produit (jpg, png, webp — max 2MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
                />
              </div>

              {/* Aperçu image */}
              {form.image && (
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Aperçu"
                  className="w-full h-40 object-cover rounded-xl border border-amber-100"
                />
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 rounded-xl transition disabled:opacity-50"
              >
                {formLoading ? "Ajout en cours..." : "Ajouter"}
              </button>
            </form>
          </div>

          {/* Liste produits */}
          <div className="bg-white rounded-2xl shadow p-6 border border-amber-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📋 Liste des produits ({products.length})
            </h2>
            {loadingP ? (
              <p className="text-amber-600 animate-pulse">Chargement...</p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {products.map((p) => (
                  <li key={p.id} className="py-3 flex justify-between items-center gap-2">
                    {/* Miniature image */}
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-lg flex-shrink-0">
                        🪡
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-sm text-gray-400">
                        {Number(p.price).toLocaleString()} FCFA — Stock : {p.stock}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditOpen(p)}
                        className="text-amber-600 hover:text-amber-800 text-sm font-medium transition"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-600 text-sm font-medium transition"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ── ONGLET COMMANDES ── */}
      {activeTab === "commandes" && (
        <div className="bg-white rounded-2xl shadow p-6 border border-amber-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📦 Toutes les commandes ({orders.length})
          </h2>
          {loadingO ? (
            <p className="text-amber-600 animate-pulse">Chargement...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-400 text-center mt-8">Aucune commande pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Client</th>
                    <th className="pb-3 pr-4">Total</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-amber-50 transition">
                      <td className="py-3 pr-4 font-mono text-gray-400">#{order.id}</td>
                      <td className="py-3 pr-4 font-medium text-gray-700">{order.user?.name ?? "—"}</td>
                      <td className="py-3 pr-4 text-amber-700 font-bold">
                        {Number(order.total_price).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 pr-4 text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          {STATUTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MODALE ÉDITION PRODUIT ── */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative max-h-screen overflow-y-auto">

            <button
              onClick={() => setEditProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              ✏️ Modifier — {editProduct.name}
            </h2>

            {editError   && <p className="text-red-600 text-sm mb-3">{editError}</p>}
            {editSuccess && <p className="text-green-600 text-sm mb-3">{editSuccess}</p>}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              {[
                { key: "name",        placeholder: "Nom du produit", type: "text"   },
                { key: "price",       placeholder: "Prix (FCFA)",    type: "number" },
                { key: "stock",       placeholder: "Stock",          type: "number" },
                { key: "category_id", placeholder: "ID Catégorie",   type: "number" },
              ].map(({ key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 mb-1 block capitalize">
                    {key.replace("_", " ")}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={editForm[key]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  rows={3}
                />
              </div>

              {/* ✅ Champ image dans la modale */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Nouvelle image (optionnel)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-amber-100 file:text-amber-700"
                />

                {/* Aperçu nouvelle image */}
                {editForm.image instanceof File && (
                  <img
                    src={URL.createObjectURL(editForm.image)}
                    alt="Aperçu"
                    className="w-full h-32 object-cover rounded-xl mt-2 border border-amber-100"
                  />
                )}

                {/* Image actuelle si pas de nouvelle */}
                {editProduct?.image && !(editForm.image instanceof File) && (
                  <img
                    src={editProduct.image}
                    alt="Image actuelle"
                    className="w-full h-32 object-cover rounded-xl mt-2 border border-amber-100"
                  />
                )}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 rounded-xl transition disabled:opacity-50"
                >
                  {editLoading ? "Sauvegarde..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}