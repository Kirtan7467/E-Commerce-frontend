import { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useLoginMutation } from '../features/auth/authApi';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();

      dispatch(
        setCredentials({
          token: res.token,
          role: res.user.role,
        })
      );

      if (res.user.role === 'admin') {
        toast.success('Logged in as Admin');
        navigate('/admin', { replace: true });
      }
      else if(res.user.role === 'vendor') {
        toast.success('Logged in as vendor');
        navigate("/vendor/dashboard", { replace: true }); 
      }
      else {
        toast.success('Logged in as User');
        navigate('/', { replace: true });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <Container className="min-vh-100 d-flex justify-content-center align-items-center">
      <Card style={{ width: 420 }} className="shadow-lg">
        <Card.Body>
          <h4 className="text-center text-primary fw-bold">Login</h4>

          <Form onSubmit={handleSubmit}>
            <Form.Control
              className="mb-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Form.Control
              className="mb-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-end mb-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <Button type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
          <div className="d-flex justify-content-center gap-1 mt-3">
            <span>Don&apos;t have an account?</span>
            <Link
              to="/register"
              className="text-primary fw-semibold text-decoration-none"
            >
              Create account
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
