import { RotatingLines } from "react-loader-spinner";

interface LoaderProps {
  /** Reserve roughly the height of the content being loaded, so swapping the
   *  spinner for the real content does not jolt the page. */
  minHeight?: number | string;
}

const Loader: React.FC<LoaderProps> = ({ minHeight = 240 }) => (
  <div
    className="flex w-full items-center justify-center"
    style={{ minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }}>
    <RotatingLines width="50" strokeColor="#000" ariaLabel="Loading" visible />
  </div>
);

export default Loader;
