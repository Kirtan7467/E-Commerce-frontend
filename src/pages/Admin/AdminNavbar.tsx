import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());              
    toast.info('Logged out successfully');
    navigate('/', { replace: true }); 
  };

  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/admin')}
        >
          Admin Panel 
        </Navbar.Brand>
        

        <Nav className="ms-auto align-items-center gap-3">
          <Nav.Link onClick={() => navigate('/admin')}>
            Dashboard
          </Nav.Link>

          <Nav.Link onClick={() => navigate('/admin/products')}>
            Products
          </Nav.Link>

          <Nav.Link onClick={() => navigate('/admin/banner')}>
            Banners
          </Nav.Link>

          <Nav.Link onClick={() => navigate('/admin/vendors')}>
            Vendors
          </Nav.Link>

          {/* 🔥 LOGOUT BUTTON */}
          <Button
            variant="outline-light"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
