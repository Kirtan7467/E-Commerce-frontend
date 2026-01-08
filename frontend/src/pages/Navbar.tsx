import { Button, Navbar, Nav, FormControl,Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../index.css";
import { useCart } from '../CartContext';
import {useState} from 'react';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {cart}=useCart();
  const[searchQuery,setSearchQuery] = useState("");

  const handleSearch =(e:React.FormEvent) =>
  {
    e.preventDefault();
    if(searchQuery.trim()==="")return;
    navigate(`/search?search=${searchQuery}`);
  }


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
          
          <Nav className="ms-auto align-items-center gap-3 navbar-links">
            <Nav.Link className="nav-hover" onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link className="nav-hover" onClick={() => navigate('/blog')}>Blog</Nav.Link>
            <Nav.Link className="nav-hover" onClick = {() => navigate("/cart")}>🛒Cart<span className="badge bg-danger">{cart.length}</span></Nav.Link>
            <Form className="d-flex me-3" onSubmit={handleSearch}>
          <FormControl
            type="text"
            placeholder="Search products..."
            className="me-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="outline-light">Search</Button>
        </Form>
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
    </>
  );
};

export default Home;

