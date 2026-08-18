import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/shared/Header";
import Conversation from "../components/messages/Conversation";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import Loader from "../components/shared/Loader";

interface ConversationRow {
  id: number;
  book: { id: number; title: string; author: string; main_cover: string } | null;
  participants: { id: number; userId: number }[];
  messages: { id: number; content: string; createdAt: string }[];
}

const Messages = () => {
  const {
    data: conversations = [],
    isLoading,
    isError,
    error,
  } = useQuery<ConversationRow[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await newRequest.get("/api/conversations");
      return Array.isArray(data) ? data : [];
    },
  });

  return (
    <div className="flex flex-col min-h-screen border border-black m-1 sm:m-2">
      <Header />
      <div className="border-black border flex-1 sm:mx-4 lg:mx-16 sm:my-4 lg:my-8">
        <div className="flex justify-between items-center p-4">
          <p className="text-2xl">Messages</p>
          <img src="/assets/file-check.svg" alt=""  width={24} height={24} />
        </div>
        <hr className="border-t-2 border-black" />
        <div>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <p className="text-center text-red-600 mt-5">
              {getErrorMessage(error, "Could not load your conversations.")}
            </p>
          ) : conversations.length > 0 ? (
            conversations.map((conversation) => (
              <Link
                to={`/messages/${conversation.id}`}
                key={conversation.id}
                className="flex gap-10 border-black mt-2">
                <Conversation
                  participants={conversation.participants || []}
                  book={conversation.book}
                  lastMessage={conversation.messages?.[0]}
                />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-5">No conversations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
