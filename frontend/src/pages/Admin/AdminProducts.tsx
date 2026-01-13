import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Table } from "react-bootstrap";
import AdminNavbar from "../../pages/Admin/AdminNavbar";
import {  useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";

interface Product {
  isActive: boolean;
  _id: string;
  title: string;
  price: number;
  vendor?: { shopName?: string; username?: string };
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://e-commerce-backend-1-m0eh.onrender.com/product");
        if (mounted) {
          setProducts(res.data.products);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // DELETE PRODUCT WITH TOAST
  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`https://e-commerce-backend-1-m0eh.onrender.com/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Unauthorized or failed to delete product");
    }
  };

  // ACTIVATE / DEACTIVATE PRODUCT WITH TOAST
  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const url = `https://e-commerce-backend-1-m0eh.onrender.com/product/${id}/${
        isActive ? "deactivate" : "activate"
      }`;

      await axios.patch(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !isActive } : p))
      );

      toast.success(
        `Product ${isActive ? "Deactivated" : "Activated"} successfully`
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to update product status");
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container style={{ marginTop: 80 }}>
        <h3 className="fw-bold mb-3">Products</h3>

        

        <Table bordered hover className="text-center mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Vendor</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No products available
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>₹{p.price}</td>
                  <td>{p.vendor?.shopName || p.vendor?.username || "admin"}</td>

                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteProduct(p._id)}
                      className="me-3"
                    >
                      Delete
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/admin/product/edit/${p._id}`)}
                      className="me-3"
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant={p.isActive ? "warning" : "success"}
                      onClick={() => toggleStatus(p._id, p.isActive)}
                    >
                      {p.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default AdminProducts;
