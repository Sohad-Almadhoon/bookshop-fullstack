import Header from "../components/shared/Header";

const Discover = () => {
  return (
    <div className="flex flex-col  min-h-screen ">
      <Header
        isDropDown
        title={
          <h3 className="text-3xl uppercase">
            NOVELS{" "}
            <span className="text-xl cursor-pointer hover:underline">
              scroll to explore
            </span>
          </h3>
        }
      />
      <div className=" border border-black flex-1">
        <div className="flex flex-col justify-center max-w-6xl w-full mx-auto ">
          <div className="flex mt-12 relative">
            <img
              src="/assets/book-1.png"
              alt=""
              className="w-96 h-[80%] cursor-pointer -rotate-12 translate-x-40 translate-y-6 hover:translate-x-0 hover:scale-75 transition-transform"
            />
            <img
              src="/assets/book-2.png"
              alt=""
              className="w-96 h-[80%] cursor-pointer z-50 translate-y-6 hover:-rotate-12 hover:scale-75 transition-transform "
            />
            <img
              src="/assets/book-3.png"
              alt=""
              className="w-96 h-[80%] cursor-pointer rotate-12 -translate-x-40 translate-y-6 hover:translate-x-0 hover:scale-75 transition-transform"
            />
          </div>
          <div className="flex z-20">
            <img
              src="/assets/wolf-left.png"
              alt=""
              className=" absolute bottom-0 left-0"
            />
            <img
              src="/assets/wolf-right.png"
              alt=""
              className=" absolute bottom-0 right-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
