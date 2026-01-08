import { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useResetPasswordMutation } from '../features/auth/authApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as { email?: string })?.email;

  if (!email) {
    return (
      <Container className="mt-5 text-center">
        <h4>Invalid request</h4>
        <p>Please start from Forgot Password.</p>
      </Container>
    );
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

     const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrorMsg(passwordError);
      return;
    }

     if (newPassword !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match');
      return;
    }

    try {
      const res = await resetPassword({
        email,
        otp,
        newPassword,
      }).unwrap();
      toast.success(res.message);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
     toast.error(err?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <Container className="min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-lg border-0 rounded-4" style={{ width: 420 }}>
        <Card.Body>
          <h4 className="text-center mb-3 text-danger fw-bold">
            Reset Password
          </h4>

          {successMsg && (
            <Alert variant="success" className="rounded-3">{successMsg}</Alert>
          )}

          {errorMsg && (
            <Alert variant="danger" className="rounded-3">{errorMsg}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Form.Text className="text-muted">
                Must be 8+ characters, include uppercase, number & special character
              </Form.Text>
            </Form.Group>

             <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mt-2"
              variant='danger'
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPassword;
