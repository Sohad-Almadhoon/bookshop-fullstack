import Header from "../components/shared/Header";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/shared/Loader";
import Button from "../components/shared/Button";
import newRequest from "../utils/newRequest";

const Success = () => {
  const sessionId = new URLSearchParams(window.location.search).get(
    "session_id"
  );
  const fetchPaymentDetails = async () => {
    if (sessionId) {
      const response = await newRequest.get(
        `/api/payment/success?session_id=${sessionId}`
      );
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.data;
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
  const updateCurrentUserInLocalStorage = () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser") || '{}');

    if (currentUser && currentUser.user) {
      currentUser.user.has_paid = true;
      localStorage.setItem("currentUser", JSON.stringify(currentUser)); 
    }
  };
   if (paymentDetails) {
     updateCurrentUserInLocalStorage();
   }

  if (isLoading) {
    return <Loader />;
  }
  console.log(paymentDetails)

  if (error) {
    return <p className="text-lg mt-5">Error fetching payment details</p>;
  }
 
  return (
    <div>
      <Header />
      <div className="flex justify-center items-center flex-col h-screen border border-black">
        <h1 className="lg:text-9xl text-7xl font-cardinal mb-7 text-green-900">
          Payment Successful!
        </h1>
        <p className="lg:text-lg text-sm lg:max-w-md max-w-sm text-center mb-5">
          Thank you for your valuable contribution. Feel free to edit the books
          and browse through them for further improvements.
        </p>

        {paymentDetails ? (
          <div className="text-center">
            <p className="text-lg mt-3 underline text-red-700 font-bold">
              Your payment of ${paymentDetails.amountTotal} has been confirmed.
            </p>
          </div>
        ) : (
          <p className="text-lg mt-5 ">Fetching payment details...</p>
        )}

        <div className="mt-10">
            <Button onClick={() => (window.location.href = document.referrer || "/")}>
            Go to Previous Page
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
