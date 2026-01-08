import { useState } from "react";
// import axios from "axios";
import { Form, Button, Card, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useVendor_registerMutation } from "../../features/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import {
  validateRequired,
  validateEmail,
  validateContact,
  validatePassword,
} from "../../utils/validation";

const VendorSignup = () => {
  const navigate = useNavigate();
  const [vendor_Register, { isLoading }] = useVendor_registerMutation();
  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    shopName: "",
    contact: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !validateRequired(
        form.username,
        form.firstname,
        form.lastname,
        form.email,
        form.password,
        form.shopName,
        form.contact
      )
    )
      return;
    if (!validateEmail(form.email)) return;
    if (!validateContact(form.contact)) return;
    if (!validatePassword(form.password)) return;
    try {
      await vendor_Register(form).unwrap();
      navigate("/login", { replace: true });
      toast.success("Signup submitted! Wait for admin approval.");
      setForm({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        shopName: "",
        contact: "",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.res?.data?.message);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Card style={{ width: "500px", height: "auto" }} className="p-4 shadow">
        <h3 className="text-center mb-3">Vendor Signup</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>firstname</Form.Label>
            <Form.Control
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>lastname</Form.Label>
            <Form.Control
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register as a vendor"}
          </Button>
          <Link
            to="/"
            className="text-primary fw-semibold d-flex justify-content-center gap-1 mt-3 "
          >
            Back to HomePage
          </Link>
        </Form>
      </Card>
    </Container>
  );
};

export default VendorSignup;
