import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import newRequest from "../../utils/newRequest"; 
import stripePromise from "../../utils/stripe";
import Button from "../shared/Button";


interface PaymentRouteProps {
  children: React.ReactNode;
}

const PaymentRoute: React.FC<PaymentRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const user = currentUser ? JSON.parse(currentUser).user : null;
    setHasPaid(user?.has_paid || false);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await newRequest.post("/api/create-checkout-session");

      if (response.status !== 200) {
        throw new Error("Failed to create checkout session");
      }

      const { id } = response.data;
      if (!id) {
        throw new Error("Checkout session ID is missing");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      const result = await stripe.redirectToCheckout({ sessionId: id });

      if (result?.error) {
        toast.error(
          result.error.message || "An unknown error occurred during redirection"
        );
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (hasPaid) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#DDD1BB]">
      <h1 className="text-2xl font-semibold text-gray-800">
        Access Restricted
      </h1>
      <p className="mt-2 text-gray-600">
        To access premium features, you need to complete your payment.
      </p>
      <Button onClick={handlePayment} disabled={loading} className="mt-4 w-fit">
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
};

export default PaymentRoute;
