import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "./app/hooks";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)!;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 📌 Fetch Cart (useCallback to fix dependency warning)
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://192.168.0.101:8000/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart || []);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 📌 Add to Cart
  const addToCart = async (productId: string) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://192.168.0.101:8000/cart/add",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Added to cart");
      fetchCart();
    } catch {
      toast.error("Add to cart failed");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Remove single item
  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `http://192.168.0.101:8000/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Removed from cart");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      const res = await axios.delete("http://192.168.0.101:8000/cart/clear", {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message || "Cart cleared");
      fetchCart();
    } catch {
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
