import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./CartContext";

const App = () => {
  return (
    <CartProvider> 
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
