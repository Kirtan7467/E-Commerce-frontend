import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Col,
  Container,
  Row,
  Pagination,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  isActive: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const res = await axios.get(
        `https://e-commerce-backend-1-m0eh.onrender.com/product?page=${page}&limit=8`
      );

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    };

    fetchProducts();
  }, [page]);

  return (
    <Container className="my-5">
      <h2 className="fw-bold text-center mb-4">All Products</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-4">
          {products.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="h-100 product-card"
                style={{
                  opacity: product.isActive ? 1 : 0.5,
                  cursor: product.isActive ? 'pointer' : 'not-allowed',
                }}
                onClick={() =>
                  product.isActive &&
                  navigate(`/product/${product._id}`)
                }
              >
                <div style={{ position: 'relative' }}>
                  <Card.Img
                    variant="top"
                    src={product.image}
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                    </div>

                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text className="fw-bold text-primary">
                    ₹{product.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* PAGINATION */}
      <Pagination className="justify-content-center mt-5">
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            key={i}
            active={i + 1 === page}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default Products;
