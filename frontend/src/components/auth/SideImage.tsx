const SideImage = () => {
  return (
    <div className="border border-black min-h-screen p-2 hidden lg:block">
      <div className="border border-black min-h-screen h-full">
        <img
          src="/assets/landing-pattern.svg"
          alt="side-img"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SideImage;
