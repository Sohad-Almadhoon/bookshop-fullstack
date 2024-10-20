import { RotatingSquare } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <RotatingSquare
        height="100"
        width="100"
        color="#233"
        ariaLabel="triangle-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;
