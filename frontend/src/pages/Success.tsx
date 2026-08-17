import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Header from "../components/shared/Header";
import Loader from "../components/shared/Loader";
import Button from "../components/shared/Button";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import { patchSessionUser } from "../utils/session";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: paymentDetails,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["paymentDetails", sessionId],
    queryFn: async () => {
      const response = await newRequest.get(
        `/api/payment/success?session_id=${encodeURIComponent(sessionId as string)}`
      );
      return response.data as { has_paid: boolean; amountTotal: number };
    },
    enabled: Boolean(sessionId),
    retry: false,
  });

  // Side effects belong in an effect, not in the render body.
  useEffect(() => {
    if (isSuccess && paymentDetails?.has_paid) {
      patchSessionUser({ has_paid: true });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Payment confirmed. Premium features unlocked!");
    }
  }, [isSuccess, paymentDetails, queryClient]);

  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error, "Could not verify your payment."));
    }
  }, [isError, error]);

  if (!sessionId) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center flex-col min-h-[60vh] gap-4">
          <p className="text-lg">No payment session was provided.</p>
          <Button className="w-fit" onClick={() => navigate("/tree")}>
            Go to Tree
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center flex-col min-h-[80vh] border border-black text-center px-4 py-10">
        {isError ? (
          <>
            <h1 className="lg:text-7xl text-5xl font-cardinal mb-7 text-red-900">
              Payment not confirmed
            </h1>
            <p className="lg:text-lg text-sm max-w-md mb-5">
              {getErrorMessage(error, "We could not verify this payment session.")}
            </p>
          </>
        ) : (
          <>
            <h1 className="lg:text-9xl text-7xl font-cardinal mb-7 text-green-900">
              Payment Successful!
            </h1>
            <p className="lg:text-lg text-sm lg:max-w-md max-w-sm mb-5">
              Thank you for your valuable contribution. Feel free to edit the books and
              browse through them for further improvements.
            </p>
            {paymentDetails && (
              <p className="text-lg mt-3 underline text-red-700 font-bold">
                Your payment of ${paymentDetails.amountTotal} has been confirmed.
              </p>
            )}
          </>
        )}

        <div className="mt-10 flex gap-3">
          {/* document.referrer pointed back at Stripe after the redirect. */}
          <Button className="w-fit" onClick={() => navigate("/tree")}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
