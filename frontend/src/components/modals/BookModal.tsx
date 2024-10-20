import React, { useState } from "react";
import Modal from "./Modal";
import Button from "../shared/Button";
import { BsArrowsAngleContract } from "react-icons/bs";
import { useBookModal } from "../../hooks/useBookModal";

const BookModal = () => {
  const { isOpen, closeModal } = useBookModal();
  const [textInput, setTextInput] = useState("");
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      title={
        <h3 className="w-full text-4xl font-semibold">
          MORAL PHILOSOPHY & THE AI PANIC
        </h3>
      }
      modalLogo="/assets/modal-icon.svg">
      <div className="flex-1 max-w-md w-full flex flex-col relative mb-10">
        <textarea
          placeholder="Start writing something."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="p-3 bg-transparent flex-1 rounded-md border-black border-opacity-30 border outline-none"></textarea>
        <div className="absolute bottom-5 right-5 border border-black border-opacity-30 p-2 rounded-full cursor-pointer">
          <BsArrowsAngleContract />
        </div>
      </div>
      {textInput.length > 0 && (
        <Button className="w-full max-w-xs">LoginMINT BLOCK $10</Button>
      )}
    </Modal>
  );
};

export default BookModal;
