import React from "react";
import Modal from "./Modal";
import Button from "../shared/Button";
import { BsCheck2} from "react-icons/bs";
import { useInvestAmountModal } from "../../hooks/useInvestAmountModal";

const InvestAmountModal = () => {
  const { isOpen, closeModal } = useInvestAmountModal();
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      image="/assets/modal1.png"
      title={<h3 className="text-5xl">invest</h3>}
      modalLogo="/assets/modal-icon.svg"
      description="Enter your investment amount">
      <div className="flex-1 flex flex-col w-full  justify-center">
        {" "}
        <div className="flex gap-3 px-12 basis-1/3">
          <div className="flex flex-1 items-center cursor-pointer justify-center rounded-2xl border border-opacity-30 border-black text-3xl relative">
            <div className=" absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center">
              <BsCheck2 className="text-white text-7xl text-opacity-70" />
            </div>
            <span> $10</span>
          </div>
          <div className="flex flex-1 items-center cursor-pointer justify-center rounded-2xl border border-opacity-30 border-black text-3xl relative">
            <div className=" absolute -top-3 bg-black text-white rounded-md px-4 py-1 flex items-center justify-center">
              <span className="text-sm">TOP PICKS</span>
            </div>
            <span> $10</span>
          </div>
          <div className="flex flex-1  items-center cursor-pointer justify-center rounded-2xl border border-opacity-30 border-black text-3xl">
            $100
          </div>
          <div className="flex flex-1 items-center justify-center cursor-pointer rounded-2xl border border-opacity-30 border-black text-3xl">
            $150
          </div>
        </div>
        <Button className="w-full  max-w-xs mt-20 self-center">invest</Button>
      </div>
    </Modal>
  );
};

export default InvestAmountModal;
