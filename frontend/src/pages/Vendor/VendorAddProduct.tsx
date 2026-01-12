import { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import VendorNavbar from "../../pages/Vendor/VendorNavbar";
import { validateRequired, validateImage } from "../../utils/validation";

const VendorAddProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    images: [] as File[],
    previews: [] as string[],
  });

  // 🔄 Fetch product (EDIT MODE)
  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://e-commerce-backend-1-m0eh.onrender.com/product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const product = res.data.product || res.data;

        setForm({
          title: product.title || "",
          price: product.price || "",
          description: product.description || "",
          images: [],
          previews: product.images
            ? product.images.map(
                (img: string) =>
                  `https://e-commerce-backend-1-m0eh.onrender.com${img}`
              )
            : [],
        });
      } catch (err) {
        toast.error("Failed to load product details");
        console.error(err);
      }
    };

    fetchProduct();
  }, [id, isEdit, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼 MULTI IMAGE HANDLER
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    for (const file of files) {
      if (!validateImage(file)) return;
    }

    setForm({
      ...form,
      images: files,
      previews: files.map((file) => URL.createObjectURL(file)),
    });
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateRequired(form.title, form.price, form.description)) return;

  if (!isEdit && form.images.length === 0) {
    toast.error("At least one image is required");
    return;
  }

  const data = new FormData();
  data.append("title", form.title);
  data.append("price", form.price.toString());
  data.append("description", form.description);

  if (form.images.length > 0) {
    form.images.forEach((file) => {
      data.append("image", file);
    });
  }

  try {
    if (isEdit) {
      await axios.put(
        `https://e-commerce-backend-1-m0eh.onrender.com/product/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Product updated successfully");
    } else {
      await axios.post(
        "https://e-commerce-backend-1-m0eh.onrender.com/product",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Product added successfully");
    }

    navigate("/vendor/dashboard");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.response?.data);
    toast.error(err.response?.data?.message || "Operation failed");
  }
};


  return (
    <>
      <VendorNavbar />

      <Container style={{ marginTop: 90, maxWidth: 600 }}>
        <Card>
          <Card.Body>
            <h4 className="fw-bold mb-3">
              {isEdit ? "Edit Product" : "Add Product"}
            </h4>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>

              {/* 🖼 PREVIEW GRID */}
              {form.previews.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  {form.previews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ))}
                </div>
              )}

              <Button type="submit" className="w-100">
                {isEdit ? "Update Product" : "Add Product"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default VendorAddProduct;
