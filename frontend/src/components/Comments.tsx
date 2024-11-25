import { FC } from "react";

const Comments = () => {

  return (
    <div className="flex flex-col justify-center items-center max-w-md overflow-y-scroll">
      <textarea
        placeholder="Enter your comments."
        value=""
        onChange={() => {}}
        className="p-3 bg-transparent border-black border-opacity-30  w-full border outline-none min-h-32 rounded-2xl placeholder:text-black placeholder:text-opacity-30"></textarea>
      <Comment />
    </div>
  );
};
  const Comment: FC = () => {
    return (
      <div className="flex mt-7 flex-col">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-4">
            {" "}
            <span className="size-8 rounded-full text-white bg-black flex justify-center items-center">
              L
            </span>{" "}
            <p className="font-bold">Liisaaa44</p>
          </div>
          <span className="text-sm"> 14:08</span>
        </div>
        <div className=" leading-5 text-gray-600 text-sm mt-4 border-b border-black pb-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
          molestias consectetur perferendis eos aperiam in debitis numquam
          autem, laborum aliquam harum reiciendis id ab nesciunt quibusdam.
          Alias necessitatibus consectetur officiis?
        </div>
      </div>
    );
  };
export default Comments;
