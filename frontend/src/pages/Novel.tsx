import FinalModal from "../components/modals/FinalModal";
import InvestModal from "../components/modals/InvestModal";
import NovelModal from "../components/modals/NovelModal";
import Button from "../components/shared/Button";
import { useModalStore } from "../store";

const Novel = () => {
  const { openModal } = useModalStore();
  return (
    <div>
      <Button onClick={openModal} variant="outline">
        Open Modal
      </Button>
      <p className="mt-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate natus
        aliquid, vel aliquam doloremque atque, molestias ut, harum blanditiis
        itaque porro. Aut, blanditiis corrupti dolorem qui totam amet animi
        omnis.
      </p>
      {/* <NovelModal /> */}
      <InvestModal />
      {/* <FinalModal /> */}
      

    </div>
  );
};

export default Novel;
