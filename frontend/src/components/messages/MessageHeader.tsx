import { BsChevronLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

const MessageHeader: React.FC = () => (
  <div className="flex justify-between h-24 items-center border-b px-12 border-black">
    <div className="flex items-center gap-2">
      <Link to="/messages">
        {" "}
        <BsChevronLeft/>
      </Link>
      <img
        src="/assets/book-1.png"
        alt="book"
        className="w-12 h-16 object-cover"
      />
      <div>
        <h3 className="text-2xl">The Watering Hole</h3>
        <span className="text-xs text-gray-500">
          We should talk more about this novel
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex items-center relative">
        <div className="w-9 h-9 border-black border rounded-full absolute right-5 z-30">
          <img src="/assets/profile.png" alt="profile" />
        </div>
        <div className="w-9 h-9 border-black border rounded-full absolute right-9 z-10"></div>
        <div className="w-9 h-9 text-sm border-black border rounded-full flex justify-center items-center z-50 bg-[#dfd4bf]">
          65+
        </div>
      </div>
      <img src="/assets/file-check.svg" alt="file-check" />
    </div>
  </div>
);
export default MessageHeader;