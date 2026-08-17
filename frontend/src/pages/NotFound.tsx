import { Link } from "react-router-dom";
import Button from "../components/shared/Button";

const NotFound = () => (
  <div className="bg-[#DDD1BB] min-h-screen font-romie flex flex-col items-center justify-center gap-4 p-6 text-center">
    <h1 className="font-cardinal text-7xl lg:text-9xl">404</h1>
    <p className="text-lg max-w-md">
      This page does not exist. It may have been moved, or the link is broken.
    </p>
    <Link to="/" className="w-full max-w-[220px]">
      <Button>Back home</Button>
    </Link>
  </div>
);

export default NotFound;
