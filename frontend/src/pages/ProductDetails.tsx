import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useCart } from "../CartContext";
import Navbar from "../pages/Navbar";

const BASE_URL = "https://e-commerce-backend-1-m0eh.onrender.com";

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
}

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `${BASE_URL}/product/${id}`
      );

      const fetchedProduct = res.data.product || res.data;

      setProduct(fetchedProduct);
      setActiveImage(fetchedProduct.images?.[0] || "");
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
      <Navbar />

      <Container className="my-5">
        <Row>
          {/* 🖼 MAIN IMAGE */}
          <Col md={6} className="mt-5">
            <div
              style={{
                width: "100%",
                height: "400px",
                overflow: "hidden",
                borderRadius: "10px",
                border: "1px solid #eee",
              }}
            >
              <img
                src={`${BASE_URL}${activeImage}`}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* 🧩 THUMBNAILS */}
            {product.images.length > 1 && (
              <div className="d-flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${BASE_URL}${img}`}
                    alt={`thumb-${i}`}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 6,
                      cursor: "pointer",
                      border:
                        activeImage === img
                          ? "2px solid #0d6efd"
                          : "1px solid #ddd",
                    }}
                  />
                ))}
              </div>
            )}
          </Col>

          {/* 📦 PRODUCT INFO */}
          <Col md={6}>
            <h2 className="fw-bold mt-5">{product.title}</h2>
            <h4 className="text-primary mt-3">₹{product.price}</h4>

            <h5 className="fw-bold mt-4">Description:</h5>
            <p className="mt-2">{product.description}</p>

            <Button
              className="btn btn-primary mt-3"
              onClick={() => addToCart(product._id)}
            >
              Add to Cart
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;
