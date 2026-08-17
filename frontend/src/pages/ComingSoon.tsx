import Header from "../components/shared/Header";

const ComingSoon = () => {
  return (
    <div>
      <Header />
      <div className="text-4xl sm:text-6xl lg:text-9xl border border-black uppercase flex items-center justify-center min-h-[70vh] text-center p-4">
        Coming Soon
      </div>
    </div>
  );
};

export default ComingSoon;
