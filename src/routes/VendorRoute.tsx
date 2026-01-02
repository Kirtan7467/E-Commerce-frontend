// src/routes/VendorRoute.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { JSX } from "react";

const VendorRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token) || localStorage.getItem("token");
  const role = useAppSelector((state) => state.auth.role) || localStorage.getItem("role");

  return token && role === "vendor" ? children : <Navigate to="/login" />;
};

export default VendorRoute;
