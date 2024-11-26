import { BsChevronLeft } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; // Assuming you're using axios for API calls
import newRequest from "../../utils/newRequest";

const MessageHeader: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>(); // Get the conversationId from the URL
  const [conversationData, setConversations] = useState<any>(null); // State to store the conversation data

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await newRequest.get(
          "/api/conversations/" + conversationId
        );
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  // If the data is not loaded yet, you can return a loading spinner or fallback UI
  if (!conversationData) {
    return <div>Loading...</div>;
  }
  console.log(conversationData);
  return (
    <div className="flex justify-between h-24 items-center border-b px-12 border-black">
      <div className="flex items-center gap-2">
        <Link to="/messages">
          <BsChevronLeft />
        </Link>
        <img
          src="/assets/book-1.png"
          alt="book"
          className="w-12 h-16 object-cover"
        />
        <div>
          <h3 className="text-2xl">
            {conversationData.bookName || "Book Name"}
          </h3>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center relative">
          <div className="w-9 h-9 border-black border rounded-full absolute right-5 z-30">
            <img src="/assets/profile.png" alt="profile" />
          </div>
          <div className="w-9 h-9 border-black border rounded-full absolute right-9 z-10"></div>
          <div className="w-9 h-9 text-sm border-black border rounded-full flex justify-center items-center z-50 bg-[#dfd4bf]">
            {conversationData.d || "0+"}
          </div>
        </div>
        <img src="/assets/file-check.svg" alt="file-check" />
      </div>
    </div>
  );
};

export default MessageHeader;
