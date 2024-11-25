import Modal from "./Modal";
import CustomInput from "../shared/CustomInput";
import Button from "../shared/Button";
import { useRef } from "react";
import { usePaymentModal } from "../../hooks/usePaymentModal";
import { useNovelModal } from "../../hooks/useNovelModal";

const PaymentModal = () => {
  const { isOpen, closeModal } = usePaymentModal(); 
  const {  openModal } = useNovelModal(); 
  const dateRef = useRef<HTMLInputElement>(null);
  const handlePayment = () => {
    closeModal();
    openModal("visual");
  }
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      image="/assets/modal2.png"
      title={<h3 className="text-5xl">invest block</h3>}
      modalLogo="/assets/modal-icon.svg"
      description="Secure Payment Info">
      <img src="/assets/payments.png" alt="payments" />
      <form className="flex-1 flex flex-col gap-5">
        <CustomInput
          placeholder="Name (as it appears in the card)"
          className="mt-3 p-3"
        />
        <CustomInput
          placeholder="Card number (no dashes or spaces)"
          className="p-3"
        />
        <div className="flex gap-3">
          {" "}
          <CustomInput
            ref={dateRef}
            type="text"
            placeholder="MM/YY"
            onFocus={() => {
              if (dateRef.current) dateRef.current.type = "month";
            }}
            onBlur={() => {
              if (dateRef.current) dateRef.current.type = "month";
            }}
          />
          <CustomInput
            type="number"
            maxLength={3}
            placeholder="CCV"
            className="p-3"
          />
        </div>
        <Button className="text-xl" onClick={handlePayment}>
          Invest as lıttle as $10
        </Button>
      </form>
    </Modal>
  );
};

export default PaymentModal;
