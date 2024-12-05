import { useEffect } from "react";
import Modal from "./Modal";
import Button from "../shared/Button";
import stripePromise from "../../utils/stripe";
import { useNovelModal } from "../../hooks/useNovelModal";
import { useLocation } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const PaymentModal = () => {
  const { openModal } = useNovelModal();
  const location = useLocation();

  const handlePayment = async () => {
    try {
      // Fetch the session id from your backend API
      const response = await newRequest.post("/api/create-checkout-session");

      if (response.status !== 200) {
        throw new Error("Failed to create checkout session");
      }

      const { id } = response.data;
      console.log(id)
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({
        sessionId: id, 
      });

      if (result?.error) {
        console.error("Stripe Checkout Error:", result.error);
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      openModal("visual");
    }
  }, [location.search, openModal]);

  return (
  <></>
  );
};

export default PaymentModal;
