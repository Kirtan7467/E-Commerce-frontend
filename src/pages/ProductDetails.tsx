import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner,Navbar, Nav,Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {addToCart} = useCart();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `http://192.168.0.101:8000/product/${id}`
      );
      setProduct(res.data);
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
  <>
   <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="px-4 shadow-sm">
        <Navbar.Brand className="fw-bold">E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="ms-auto align-items-end gap-3 navbar-links">
            <Nav.Link className="nav-hover" onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link className="nav-hover" onClick={() => navigate('/category')}>Category</Nav.Link>
            <Nav.Link className="nav-hover" onClick={() => navigate('/blog')}>Blog</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    <Container className="my-5">
      <Row>
 <Col md={6} className="mt-5">
            <div style={{ 
              width: "100%", 
              height: "400px", 
              overflow: "hidden", 
              borderRadius: "10px" 
            }}>
              <img
                src={`http://192.168.0.101:8000${product.image}`}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
          </Col>

        <Col md={6}>
          <h2 className="fw-bold mt-5">{product.title}</h2>
          <h4 className="text-primary mt-3">₹{product.price}</h4>
          <h5 className=" fw-bold mt-4">Description:</h5>
          <p className="mt-2">  {product.description}</p>
        </Col>
      </Row>

      <Button className="btn btn-primary mt-3"
      onClick={() => addToCart(product._id)}>
        Add to Cart
      </Button>
    </Container>
    </>
  );
};

export default ProductDetails;
