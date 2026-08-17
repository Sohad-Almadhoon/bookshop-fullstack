import toast from "react-hot-toast";
import { useNovelModal } from "../../hooks/useNovelModal";
import Button from "../shared/Button";
import ActionButtons from "./ActionButtons";
import useAccount from "../../hooks/useAccount";
import useCheckout from "../../hooks/useCheckout";

const Sidebar = ({ imgUrl, description }: { imgUrl: string; description: string }) => {
  const { openModal } = useNovelModal();
  // Server-verified: has_paid used to be read from localStorage.
  const { hasPaid, isChecking } = useAccount();
  const checkout = useCheckout();

  const handleClick = () => {
    if (isChecking) {
      toast("Checking your subscription…");
      return;
    }
    if (hasPaid) {
      openModal("visual");
      return;
    }
    checkout.mutate();
  };

  return (
    <>
      <div className="border-r lg:my-2 mt-4 border-black justify-end lg:max-w-xl w-full flex-1 p-4 flex flex-col sm:px-8 lg:px-28">
        <Button onClick={handleClick} disabled={checkout.isPending || isChecking}>
          {isChecking
            ? "Checking…"
            : checkout.isPending
            ? "Processing…"
            : hasPaid
            ? "Create New Chapter"
            : "Subscribe for $5 to contribute"}
        </Button>
        <div>
          <div className="mt-4">
            <img
              src={imgUrl}
              alt="book cover"
              // portrait ratio: a square frame cropped the top of every cover
              className="w-full max-w-xs sm:max-w-sm aspect-[2/3] mx-auto object-cover"
            />
            <p className="text-xs text-gray-800 bg-white p-2 rounded-b-lg">{description}</p>
            <ActionButtons />
          </div>
        </div>
      </div>
      <hr className="border-t border-black" />
    </>
  );
};

export default Sidebar;
