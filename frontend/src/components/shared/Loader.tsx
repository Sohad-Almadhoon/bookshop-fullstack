import { RotatingLines} from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center mt-2 h-full w-full">
      <RotatingLines
        width="50"
        strokeColor="#000"
        ariaLabel="triangle-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;
