import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "./app/hooks";
import axiosInstance from "./api/axiosInstance";



interface CartItem {
  _id: string;
  productId:string;
  title: string;
  price: number;
  image: string;
  quantity: number;
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


export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = useAppSelector((state) => state.auth.token);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================== FETCH CART ================== */
 const fetchCart = useCallback(async () => {
  if (!token) return;

  try {
    setLoading(true);
    const res = await axiosInstance.get("/cart");

    console.log("RAW CART RESPONSE:", res.data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedCart: CartItem[] = (res.data.items || []).map((item: any) => ({
      _id: item._id,
      productId: item.product?._id,
      title: item.product?.title || item.title,
      price: item.product?.price || item.price,
      image: item.product?.image
        ? `https://e-commerce-backend-1-m0eh.onrender.com${item.product.image}`
        : "",
      quantity: item.quantity,
    }));

    console.log("MAPPED CART:", mappedCart);

    setCart(mappedCart);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load cart");
  } finally {
    setLoading(false);
  }
}, [token]);


  const addToCart = async (productId: string) => {
    if (!token) {
      toast.error("Please login to add items");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/cart/add", { productId });
      toast.success(res.data.message || "Added to cart");
      fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Add to cart failed");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/cart/remove/${productId}`);
      toast.success(res.data.message || "Removed from cart");
      fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axiosInstance.delete("/cart/clear");
      toast.success(res.data.message || "Cart cleared");
      fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart([]); 
    }
  }, [token, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
