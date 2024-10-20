import Button from "../components/shared/Button";
import { useNovelModal } from "../hooks/useNovelModal";

const Novel = () => {
  const { openModal } = useNovelModal();
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
    </div>
  );
};

export default Novel;
