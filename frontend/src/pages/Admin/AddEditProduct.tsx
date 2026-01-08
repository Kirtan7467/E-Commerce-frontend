import { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import AdminNavbar from "../../pages/Admin/AdminNavbar";
import { validateRequired, validateImage } from "../../utils/validation";

const AddEditProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    image: null as File | null,
    preview: "",
  });

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      const res = await axios.get(`https://e-commerce-backend-1-m0eh.onrender.com/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        title: res.data.title,
        price: res.data.price,
        description: res.data.description,
        image: null,
        preview: `https://e-commerce-backend-1-m0eh.onrender.com${res.data.image}`,
      });
    };

    fetchProduct();
  }, [id, isEdit, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!validateImage(e.target.files[0])) return;
      setForm({
        ...form,
        image: e.target.files[0],
        preview: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequired(form.title, form.price, form.description)) return;

    if (!isEdit && !validateImage(form.image)) return; // only required on create, not edit

    const data = new FormData();
    data.append("title", form.title);
    data.append("price", form.price.toString());
    data.append("description", form.description);

    if (form.image) {
      data.append("image", form.image);
    }

    try {
      if (isEdit) {
        await axios.put(`https://e-commerce-backend-1-m0eh.onrender.com/product/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post("https://e-commerce-backend-1-m0eh.onrender.com/product", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product added successfully");
      }

      navigate("/admin/products");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  return (
    <>
      <AdminNavbar />

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
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>

              {form.preview && (
                <img
                  src={form.preview}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    marginBottom: 12,
                  }}
                />
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

export default AddEditProduct;
