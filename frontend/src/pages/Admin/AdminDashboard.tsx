import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../pages/Admin/AdminNavbar';
import { useAppSelector } from "../../app/hooks";

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [activeBanners, setActiveBanners] = useState(0);
  const [inactiveBanners, setInactiveBanners] = useState(0);
  const [activeVendors, setActiveVendors] = useState(0);

  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productRes = await axios.get('https://e-commerce-backend-1-m0eh.onrender.com/product');
        const bannerRes = await axios.get('https://e-commerce-backend-1-m0eh.onrender.com/banner');
        setProductCount(productRes.data.products.length);
        const vendorRes = await axios.get('https://e-commerce-backend-1-m0eh.onrender.com/vendor',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActiveVendors(vendorRes.data.vendors.length);

        const banners = bannerRes.data.banners;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setActiveBanners(banners.filter((b: any) => b.isActive).length);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setInactiveBanners(banners.filter((b: any) => !b.isActive).length);

      } catch (error) {
        console.log("Dashboard fetch failed", error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <>
      <AdminNavbar />

      <Container style={{ marginTop: 80 }}>
        <h3 className="fw-bold mb-4">Admin Dashboard</h3>

        {/* ===== STATS CARDS ===== */}
        <Row className="g-4 mb-4">

          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6>Total Products</h6>
                <h2 className="fw-bold">{productCount}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6>Active Banners</h6>
                <h2 className="fw-bold text-success">{activeBanners}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6>Inactive Banners</h6>
                <h2 className="fw-bold text-danger">{inactiveBanners}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm">
              <Card.Body>
                <h6>Total Vendors</h6>
                <h2 className="fw-bold text-primary">{activeVendors}</h2>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        {/* ===== QUICK ACTIONS ===== */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">Quick Actions</h5>

            <div className="d-flex flex-wrap gap-3">
              <Button onClick={() => navigate('/admin/product/add')}>
                ➕ Add Product
              </Button>

              <Button variant="secondary" onClick={() => navigate('/admin/products')}>
                📦 Manage Products
              </Button>

              <Button variant="warning" onClick={() => navigate('/admin/banner')}>
                🖼 Manage Banners
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* ===== VENDOR SECTION ===== */}
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="fw-bold mb-3">Vendor Actions</h5>

            <div className="d-flex flex-wrap gap-3">
              <Button variant="dark" onClick={() => navigate('/admin/vendors')}>
                📈 Manage Vendors
              </Button>
            </div>
          </Card.Body>
        </Card>

      </Container>
    </>
  );
};

export default AdminDashboard;
