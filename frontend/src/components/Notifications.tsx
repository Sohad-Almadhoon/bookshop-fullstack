import { BsListCheck } from "react-icons/bs";

const Notifications = () => {
  return (
    <div className=" w-[400px] border-black border p-2 min-h-96 z-20 absolute top-14 right-10 bg-[#dfd4bf]">
      <div className=" border-black border p-3  min-h-96">
        {" "}
        <div className="flex items-center justify-between text-3xl">
          <p className="font-bold">Notifications</p>
          <BsListCheck />
        </div>
        <hr className="h-1 my-1 bg-black" />
      </div>
    </div>
  );
};

export default Notifications;
