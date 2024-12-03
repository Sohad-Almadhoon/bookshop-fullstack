import { useNovelModal } from "../../hooks/useNovelModal";
import Button from "../shared/Button";
import ActionButtons from "./ActionButtons";

const Sidebar = ({ imgUrl }:{imgUrl:string}) => {
  const { openModal } = useNovelModal();

  return (
    <div className="border-r border-black justify-end flex-1 lg:p-4 flex flex-col px-28">
      <Button onClick={() => openModal("visual")}>
        invest as little as <sup>$</sup>10
      </Button>
      <div >
        <div className="mt-4">
          <img src={imgUrl} alt="book cover" className="h-full w-full object-cover" />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
