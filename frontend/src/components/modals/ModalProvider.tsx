import { useEffect, useState } from "react";
import NovelModal from "./NovelModal";
import BookModal from "./BookModal";
import InvestModal from "./PaymentModal";
import FinalModal from "./FinalModal";
import CommentModal from "./CommentModal";

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
      <CommentModal/>
      <NovelModal />
      <BookModal />
      <InvestModal />
      <FinalModal />
    </>
  );
};

export default ModalProvider;
