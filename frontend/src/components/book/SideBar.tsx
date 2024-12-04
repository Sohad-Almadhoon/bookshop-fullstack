import { useNovelModal } from "../../hooks/useNovelModal";
import Button from "../shared/Button";
import ActionButtons from "./ActionButtons";

const Sidebar = ({ imgUrl }:{imgUrl:string}) => {
  const { openModal } = useNovelModal();

  return (
    <>
      <div className="border-r lg:my-2 mt-4 border-black justify-end  lg:max-w-xl w-full flex-1 p-4 flex flex-col lg:px-28">
        <Button onClick={() => openModal("visual")}>
          invest as little as <sup>$</sup>10
        </Button>
        <div>
          <div className="mt-4">
            <img
              src={imgUrl}
              alt="book cover"
              className="lg:h-full h-96 w-96 mx-auto object-cover"
            />
            <ActionButtons />
          </div>
        </div>
      </div>
      <hr className="border-t border-black" />
    </>
  );
};
export default Sidebar;
