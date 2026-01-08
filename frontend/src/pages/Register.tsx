import { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useRegisterMutation } from "../features/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  validateRequired,
  validateEmail,
  validateContact,
  validatePassword,
} from "../utils/validation";

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        form.contact,
        form.password
      )
    )
      return;
    if (!validateEmail(form.email)) return;
    if (!validateContact(form.contact)) return;
    if (!validatePassword(form.password)) return;

    try {
      await registerUser(form).unwrap();
      toast.success("Registration successful. Please login.");
      navigate("/login", { replace: true });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err?.data?.message || "Registration failed";

      if (message.toLowerCase().includes("email")) {
        toast.error("Email already exists. Please use a different email.");
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <Container className="min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-lg border-0 rounded-4" style={{ width: 460 }}>
        <Card.Body>
          <h4 className="text-center mb-3 text-success fw-bold">
            Create Account
          </h4>

          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Control
              className="mb-2 rounded-3"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />

            <Form.Control
              className="mb-2 rounded-3"
              name="firstname"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
            />

            <Form.Control
              className="mb-2 rounded-3"
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
            />

            <Form.Control
              className="mb-2 rounded-3"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <Form.Control
              className="mb-2 rounded-3"
              name="contact"
              placeholder="Contact"
              value={form.contact}
              onChange={handleChange}
            />

            <Form.Control
              autoComplete="off"
              className="mb-3 rounded-3"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              className="w-100 mt-2"
              variant="success"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <div className="d-flex justify-content-center gap-1 mt-3">
              <span>already have a account ?</span>
              <Link to="/login" className="text-primary fw-semibold">
                Login
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
