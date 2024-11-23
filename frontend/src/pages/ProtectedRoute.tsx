import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
