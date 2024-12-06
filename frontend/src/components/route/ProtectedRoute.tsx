import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = localStorage.getItem("currentUser");
  const token = currentUser ? JSON.parse(currentUser).token : null;
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
