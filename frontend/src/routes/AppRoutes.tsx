import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Product';
import ProductDetails from '../pages/ProductDetails';
import Login from '../pages/Login';
import Cart from '../pages/Cart'
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminBanner from '../pages/Admin/AdminBanner';

import AdminRoute from './AdminRoute';
import Register from '../pages/Register';
import AddEditProduct from '../pages/Admin/AddEditProduct';
// import AddProduct from '../pages/Admin/AddProduct';

import VendorSignup from '../pages/Vendor/VendorSingup';
import Managevendor from '../pages/Vendor/ManageVendor';
import VendorAddProduct from '../pages/Vendor/VendorAddProduct';
import VendorDashboard from '../pages/Vendor/VendorDashBoard';
import VendorRoute from './VendorRoute';
import UploadExcel from "../pages/Vendor/UploadExcel";
import SearchResults from '../SearchResults';

const AppRoutes = () => (
  <Routes>
    {/* USER */}
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path = "/cart" element={<Cart/>}/>
    <Route path="/search" element={<SearchResults />} />
    
    {/*vendor */}
     <Route path="/VendorSignUp" element={<VendorSignup />} />

    <Route path="/vendor/dashboard" element={
      <VendorRoute>
        <VendorDashboard />
      </VendorRoute>
    }/>

    <Route path="/vendor/product/add" element={
      <VendorRoute>
        <VendorAddProduct />
      </VendorRoute>
    }/>

    <Route path="/vendor/product/edit/:id" element={
      <VendorRoute>
        <VendorAddProduct />
      </VendorRoute>
    }/>

    <Route path="/vendor/upload-excel" element={
      <VendorRoute>
        <UploadExcel />
      </VendorRoute>
    }/>




    {/* ADMIN */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/products"
      element={
        <AdminRoute>
          <AdminProducts />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/banner"
      element={
        <AdminRoute>
          <AdminBanner />
        </AdminRoute>
      }
      />
      <Route
      path="/admin/product/add"
      element={
        <AdminRoute>
          <AddEditProduct />
        </AdminRoute>
      }
/>

      <Route
      path="/admin/vendors"
      element={
        <AdminRoute>
          <Managevendor />
        </AdminRoute>
      }
/>

      <Route
  path="/admin/product/edit/:id"
  element={
    <AdminRoute>
      <AddEditProduct />
    </AdminRoute>
  }
/>
  </Routes>
);

export default AppRoutes;
