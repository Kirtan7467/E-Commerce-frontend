import { Button, Navbar, Nav } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../index.css";
import Banner from "./Banner";
import Products from './Product';
import { useCart } from '../CartContext';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {cart}=useCart();

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="px-4 shadow-sm">
        <Navbar.Brand className="fw-bold">E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="ms-auto align-items-end gap-3 navbar-links">
            <Nav.Link className="nav-hover" onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link className="nav-hover" onClick={() => navigate('/category')}>Category</Nav.Link>
            <Nav.Link className="nav-hover" onClick={() => navigate('/blog')}>Blog</Nav.Link>
            <Nav.Link onClick = {() => navigate("/cart")}>🛒Cart<span className="badge bg-danger">{cart.length}</span></Nav.Link>
            {!isAuthenticated ? (
              <Button
                variant="outline-light"
                className='btn-hover'
                onClick={() => navigate('/login', { replace: true })}
              >
                Login
              </Button>
            ) : (
              <Button variant="danger" className='btn-hover' onClick={handleLogout}>
                Logout
              </Button>
            )}

            <Button 
             variant="outline-light"
                className='btn-hover'
                onClick={() => navigate('/VendorSignup', { replace: true })}
                >
             Vendor
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
       <Banner/>
      <Products/>
    </>
  );
};

export default Home;
