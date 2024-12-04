import Header from "../components/shared/Header";
import { Link } from "react-router-dom";
import Conversation from "../components/messages/Conversation";
import newRequest from "../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/shared/Loader";

const Messages = () => {
  const fetchConversations = async () => {
    const { data } = await newRequest.get("/api/conversations");
    return data;
  };
  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen border border-black m-2">
      <Header />
      <div className="border-black border lg:mx-16 lg:my-8 h-screen">
        <div className="flex justify-between items-center p-4">
          <p className="text-2xl">Messages</p>
          <img src="/assets/file-check.svg" alt="file-check" />
        </div>
        <hr className="border-t-2 border-black" />
        <div>
          {conversations.length > 0 ? (
            conversations.map((conversation: any) => (
              <Link
                to={`/messages/${conversation.id}`}
                key={conversation.id}
                className="flex gap-10 border-black mt-2"
                state={{
                  book: conversation.book,
                }}>
                <Conversation
                  participants={conversation.participants}
                  book={conversation.book}
                  messages={conversation.messages}
                />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No conversations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
