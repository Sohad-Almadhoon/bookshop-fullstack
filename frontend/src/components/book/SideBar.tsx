import { useNovelModal } from "../../hooks/useNovelModal";
import newRequest from "../../utils/newRequest";
import Button from "../shared/Button";
import ActionButtons from "./ActionButtons";
import stripePromise from "../../utils/stripe";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = ({
  imgUrl,
  description,
}: {
  imgUrl: string;
  description: string;
}) => {
  const { openModal } = useNovelModal();
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (currentUser?.user?.has_paid) {
      setHasPaid(true);
    } else {
      setHasPaid(false);
    }
  }, []);
  const handlePayment = useMutation<void, Error>({
    mutationFn: async () => {
      if (hasPaid) {
        openModal("visual");
        return;
      }
      try {
        const response = await newRequest.post("/api/create-checkout-session");

        if (response.status !== 200) {
          throw new Error("Failed to create checkout session");
        }

        const { id } = response.data;
        const stripe = await stripePromise;
        const result = await stripe?.redirectToCheckout({
          sessionId: id,
        });

        if (result?.error) {
          toast.error(result.error.message || "An unknown error occurred");
        }
      } catch (error) {
        toast.error("Payment Error");
      }
    },
  });

  return (
    <>
      <div className="border-r lg:my-2 mt-4 border-black justify-end  lg:max-w-xl w-full flex-1 p-4 flex flex-col lg:px-28">
        <Button onClick={() => handlePayment.mutate()}>
          {hasPaid ? "Create Content for 5$" : "Subscribe For More"}
        </Button>
        <div>
          <div className="mt-4">
            <img
              src={imgUrl}
              alt="book cover"
              className="h-96 w-96 mx-auto object-cover"
            />
            <p className="text-xs text-gray-800 bg-white p-2 rounded-b-lg">
              {description}
            </p>
            <ActionButtons />
          </div>
        </div>
      </div>
      <hr className="border-t border-black" />
    </>
  );
};
export default Sidebar;
