import { useEffect, useState } from "react";
import NovelModal from "../components/modals/NovelModal";
import InvestModal from "../components/modals/PaymentModal";
import FinalModal from "../components/modals/FinalModal";
import CommentModal from "../components/modals/CommentModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  //* useEffect hook to set isMounted to true after the initial render
  //* This prevents the modals from rendering on the server-side (SSR)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  //* If the component is not mounted, don't render anything
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CommentModal />
      <NovelModal />
      <InvestModal />
      <FinalModal />
    </>
  );
};

export default ModalProvider;
