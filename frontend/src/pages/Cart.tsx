import { useCart } from "../CartContext";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import Navbar from "./Navbar";

const Cart = () => {
  const { cart, loading, removeFromCart, clearCart } = useCart();

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner />
      </div>
    );

  if (cart.length === 0)
    return <h2 className="text-center mt-5">🛒 Cart is Empty</h2>;

  const total = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <>
    <Navbar/>
    <Container className="mt-5">
      <h2 className="fw-bold mb-3">My Cart</h2>
    
      <Table bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.image} width="60" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
              <td>₹{item.quantity * item.price}</td>
              <td>
                <Button
                
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3 className="text-end fw-bold mt-3">
        Grand Total: ₹{total}
      </h3>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={clearCart}>
          Clear Cart
        </Button>
        <Button variant="success">Checkout</Button>
      </div>
    </Container>
    </>
  );
};

export default Cart;
