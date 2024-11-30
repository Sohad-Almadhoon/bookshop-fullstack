import Modal from "./Modal";
import { useCommentModal } from "../../hooks/useCommentModal";
import Comments from "../book/Comments";
const CommentModal = () => {
  const { isOpen, closeModal } = useCommentModal();
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      modalLogo="/assets/modal-icon.svg">
      {" "}
      <Comments />
    </Modal>
  );
};

export default CommentModal;
