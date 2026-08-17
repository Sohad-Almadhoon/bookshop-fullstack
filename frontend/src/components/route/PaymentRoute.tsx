import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import Loader from "../shared/Loader";
import useAccount from "../../hooks/useAccount";
import useCheckout from "../../hooks/useCheckout";

interface PaymentRouteProps {
  children: React.ReactNode;
}

const PaymentRoute: React.FC<PaymentRouteProps> = ({ children }) => {
  const { hasPaid, isChecking, isError, error } = useAccount();
  const checkout = useCheckout();

  // Toasts belong in an effect: firing one during render loops on re-render.
  useEffect(() => {
    if (isError) {
      toast.error((error as Error)?.message || "Could not verify your subscription.");
    }
  }, [isError, error]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#DDD1BB]">
        <Loader />
      </div>
    );
  }

  if (hasPaid) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#DDD1BB] text-center px-4">
      <h1 className="text-2xl font-semibold text-gray-800">Access Restricted</h1>
      <p className="mt-2 text-gray-600">
        To access premium features, you need to complete your payment.
      </p>
      <Button
        onClick={() => checkout.mutate()}
        disabled={checkout.isPending}
        className="mt-4 w-fit">
        {checkout.isPending ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
};

export default PaymentRoute;
