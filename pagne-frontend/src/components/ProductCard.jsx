import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px" }}>
      <h3>{product.name}</h3>
      <p>{product.price} FCFA</p>

      <button onClick={() => addToCart(product)}>
        Ajouter au panier
      </button>
    </div>
  );
}