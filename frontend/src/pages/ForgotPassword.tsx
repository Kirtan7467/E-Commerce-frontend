import { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useForgotPasswordMutation } from '../features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      toast.success('OTP sent to your email');
      navigate('/reset-password', { state: { email }, replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <Container className="min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="shadow border-0 rounded-4" style={{ width: 400 }}>
        <Card.Body>
          <h4 className="text-center mb-3 text-warning fw-bold">
            Forgot Password
          </h4>


          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
            className="w-100 mt-3"
            type="submit"
            variant="warning"
            disabled={isLoading}
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
