import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken } from "../../utils/session";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    // `state` lets the login page send the user back where they were heading.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
