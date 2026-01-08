import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Container, Row, Button, Table } from "react-bootstrap";
import VendorNavbar from "./VendorNavbar";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  isActive: boolean;
}

const VendorDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();

  // Fetch Vendor Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://e-commerce-backend-1-m0eh.onrender.com/product/vendor",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProducts(res.data.products || []);
      } catch (err) {
        toast.error("Failed to load vendor products");
        console.log(err);
      }
    };

    fetchProducts();
  }, [token]);

  // Delete Product
  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`https://e-commerce-backend-1-m0eh.onrender.com/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
      console.log(err);
    }
  };

  // Toggle Active / Inactive
  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const url = `https://e-commerce-backend-1-m0eh.onrender.com/product/${id}/${
        isActive ? "deactivate" : "activate"
      }`;

      const res = await axios.patch(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Updated:", res.data);

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !isActive } : p))
      );

      toast.success(`Product ${isActive ? "Deactivated" : "Activated"}`);
    } catch (err) {
      toast.error("Status update failed");
      console.log(err);
    }
  };

  return (
    <>
      <VendorNavbar />

      <Container style={{ marginTop: 80 }}>
        <h3 className="fw-bold mb-4">Vendor Dashboard</h3>

        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6>Total My Products</h6>
                <h2 className="fw-bold">{products.length}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6>Active Products</h6>
                <h2 className="fw-bold text-success">
                  {products.filter((p) => p.isActive).length}
                </h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6>Inactive Products</h6>
                <h2 className="fw-bold text-danger">
                  {products.filter((p) => !p.isActive).length}
                </h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="fw-bold text-start mb-3">
          <h3>Total Products</h3>
        </div>
        <div className="text-end mb-3">
          <Button onClick={() => navigate("/vendor/product/add")}>
            ➕ Add New Product
          </Button>
           <Button
          className="btn btn-success ms-3 "
          onClick={() => navigate("/vendor/upload-excel")}
        >
          Upload Excel
        </Button>
        </div>
        

        <Table bordered hover className="text-center">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Status</th>
              <th colSpan={3} className="text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>₹{p.price}</td>
                  <td>{p.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => navigate(`/vendor/product/edit/${p._id}`)}
                    >
                      Edit
                    </Button>
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant={p.isActive ? "secondary" : "success"}
                      onClick={() => toggleStatus(p._id, p.isActive)}
                    >
                      {p.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
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

export default VendorDashboard;
