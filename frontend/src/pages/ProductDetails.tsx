import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner,Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useCart } from '../CartContext';
import Navbar from "../pages/Navbar"

const ProductDetails = () => {
  const { id } = useParams();

  const {addToCart} = useCart();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `https://e-commerce-backend-1-m0eh.onrender.com/product/${id}`
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
   <Navbar/>
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
                src={`https://e-commerce-backend-1-m0eh.onrender.com${product.image}`}
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
