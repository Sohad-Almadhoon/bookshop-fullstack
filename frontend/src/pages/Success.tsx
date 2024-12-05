import Header from "../components/shared/Header";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/shared/Loader";
import Button from "../components/shared/Button";

const Success = () => {
  const sessionId = new URLSearchParams(window.location.search).get(
    "session_id"
  );

  const fetchPaymentDetails = async () => {
    if (sessionId) {
      const response = await fetch(
        `/api/payment/success?session_id=${sessionId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
    return null;
  };

  const {
    data: paymentDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["paymentDetails", sessionId],
    queryFn: fetchPaymentDetails,
    enabled: !!sessionId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-lg mt-5">Error fetching payment details</p>;
  }

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center flex-col h-screen border border-black">
        <h1 className="lg:text-9xl text-7xl font-cardinal mb-7">
          Congratulations
        </h1>
        <p className="lg:text-lg text-sm lg:max-w-md max-w-sm text-center mb-5">
          Thank you for your valuable contribution. Feel free to edit the books
          and browse through them for further improvements.
        </p>

        {paymentDetails ? (
          <div className="text-center">
            <p className="text-lg">Payment Successful!</p>
            <p className="text-md mt-3">
              Your payment of ${paymentDetails.amount / 100} has been confirmed.
            </p>
            <p className="text-md mt-1">
              Subscription Plan: {paymentDetails.subscriptionName}
            </p>
          </div>
        ) : (
          <p className="text-lg mt-5">Fetching payment details...</p>
        )}

        <div className="mt-10">
          <Button onClick={() => (window.location.href = "/")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
