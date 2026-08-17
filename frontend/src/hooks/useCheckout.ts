import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import stripePromise from "../utils/stripe";

/**
 * Creates a Stripe checkout session and redirects. Shared by every "pay" button
 * so the error handling and toasts stay identical everywhere.
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await newRequest.post("/api/create-checkout-session");

      if (data?.alreadyPaid) {
        return { alreadyPaid: true as const };
      }

      // Prefer the hosted URL Stripe returns - no publishable key needed.
      if (data?.url) {
        window.location.assign(data.url);
        return { redirected: true as const };
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Failed to load Stripe.");
      if (!data?.id) throw new Error("Checkout session ID is missing.");

      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      if (result?.error) throw new Error(result.error.message || "Redirection failed.");
      return { redirected: true as const };
    },
    onSuccess: (result) => {
      if ("alreadyPaid" in result) {
        toast.success("Your subscription is already active.");
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Payment could not be started."));
    },
  });
};

export default useCheckout;
