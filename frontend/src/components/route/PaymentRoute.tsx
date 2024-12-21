import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import newRequest from "../../utils/newRequest"; // Assuming this is your Axios instance
import stripePromise from "../../utils/stripe";

// Initialize Stripe

interface PaymentRouteProps {
  children: React.ReactNode;
}

const PaymentRoute: React.FC<PaymentRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    // Check payment status from localStorage
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800">
        Access Restricted
      </h1>
      <p className="mt-2 text-gray-600">
        To access premium features, you need to complete your payment.
      </p>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`mt-6 px-6 py-2 rounded-lg text-white font-medium ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentRoute;
