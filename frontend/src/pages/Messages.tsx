import React, { useState, useEffect } from "react";
import Header from "../components/shared/Header";
import { Link } from "react-router-dom";
import Conversation from "../components/messages/Conversation";
import newRequest from "../utils/newRequest"; // Helper for API requests

interface ConversationData {
  id: number;
  sender: {
    name: string;
    avatar: string;
  };
  book: {
    title: string;
    image: string;
  };
  lastMessage: string;
  unread: number;
  time: string;
}

const Messages = () => {
  const [conversations, setConversations] = useState<ConversationData[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await newRequest.get("/api/conversations");
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, []);
console.log(conversations)
  return (
    <div className="min-h-screen border border-black m-2">
      <Header profile />
      <div className="border-black border mx-16 my-8 h-screen">
        <div className="flex justify-between items-center p-4">
          <p className="text-2xl">Messages</p>
          <img src="/assets/file-check.svg" alt="file-check" />
        </div>
        <div>
          {conversations.length > 0 ? (
            conversations.map((conversation: any) => (
              <Link
                to={`/messages/${conversation.id}`}
                key={conversation.id}
                className="flex gap-10 border-black mt-2">
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
