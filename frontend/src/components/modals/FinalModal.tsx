import { useFinalModal } from "../../hooks/useFinalModal";
import Button from "../shared/Button";
import Modal from "./Modal";

const FinalModal = () => {
  const { isOpen, closeModal } = useFinalModal();
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      image="/assets/modal3.png"
      title={<h3 className="text-5xl max-w-md w-full">YOU ARE NOW A CONTRIBUTOR</h3>}
      modalLogo="/assets/modal-icon.svg"
      description=" Congratulations! You are now part of the ‘Worldview Ethics’ BlockBook.
        You have successfully exchanged your Intellectual Property Rights for
        perpetual Royalties and 200 IP credits. You will now have access to a
        private group chat with the Architect and other contributors.">
      <Button className="max-w-sm w-full mt-8">VIEW CONTRIBUTION</Button>
    </Modal>
  );
};

export default FinalModal;
