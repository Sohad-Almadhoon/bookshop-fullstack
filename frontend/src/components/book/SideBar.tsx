import { useNovelModal } from "../../hooks/useNovelModal";
import Button from "../shared/Button";
import ActionButtons from "./ActionButtons";

const Sidebar= () => {
  const { openModal } = useNovelModal();

  return (
    <div className="border-r border-black justify-end flex-1 p-4 flex flex-col px-28">
      <Button onClick={() => openModal("visual")}>
        invest as little as <sup>$</sup>10
      </Button>
      <div className="self-end">
        
        <ActionButtons />
      </div>
    </div>
  );
};
export default Sidebar;