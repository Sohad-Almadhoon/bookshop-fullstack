import React from "react";
import { Navigate } from "react-router-dom";

interface PaymentRouteProps {
  children: React.ReactNode;
}

const PaymentRoute: React.FC<PaymentRouteProps> = ({ children }) => {
  const currentUser = localStorage.getItem("currentUser");
  const user = currentUser ? JSON.parse(currentUser).user : null;
  if (!user.has_paid) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

export default PaymentRoute;
