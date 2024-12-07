import React from "react";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";
import { BsSendFill } from "react-icons/bs";
import Header from "../components/shared/Header";
import MessageHeader from "../components/messages/MessageHeader";
import MessageItem from "../components/messages/MessageItem";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import Loader from "../components/shared/Loader";

// Fetch messages function
const fetchMessages = async (id: string) => {
  const response = await newRequest.get(`/api/messages/${id}`);
  return response.data;
};

// Send message function
const sendMessageToApi = async (id: string, message: string) => {
  const newMessage = { content: message };
  await newRequest.post(`/api/messages/${id}`, newMessage);
};

const Message: React.FC = () => {
  const messageRef = React.useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const currentUser = localStorage.getItem("currentUser");
  const user = currentUser ? JSON.parse(currentUser).user : null;

  const queryClient = useQueryClient();

  const {
    data: messages,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => fetchMessages(id!),
    enabled: !!id, // Only run the query if `id` is available
  });

  interface Message {
    id: string;
    content: string;
    senderId: string;
    sender: {
      name: string;
      email: string;
      created_at: string;
    };
  }

  const mutation = useMutation({
    mutationFn: (newMessage: string) => sendMessageToApi(id!, newMessage),
    onSuccess: () => {
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["messages", id] }); // Invalidate and refetch messages after sending
      }
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    onError: (error: unknown) => {
      console.error("Error sending message:", error);
    },
  });

  const sendMessage = (message: string) => {
    if (message) {
      mutation.mutate(message); // Send the message via mutation
    }
  };

  return (
    <div className="flex flex-col min-h-screen border border-black m-2">
      <Header />
      <div className="border-black flex-1 flex flex-col border lg:mx-16 lg:mt-8">
        <MessageHeader />
        <div className="px-12 flex flex-1 flex-col">
          <div className="flex-1 max-h-[60vh] overflow-auto">
            {isLoading && <Loader />}
            {isError && <div>Error loading messages.</div>}
            {messages?.map((msg: Message) => (
              <MessageItem
                text={msg.content}
                isMe={msg.senderId === user?.id}
                senderName={msg.sender.name}
                time={msg.sender.created_at}
                key={msg.id}
              />
            ))}
            <div ref={messageRef} />
          </div>
          <div className="flex items-center gap-3">
            <CustomInput
              className="my-5 w-full p-3 flex-3 rounded-xl"
              placeholder="Write a message"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value) {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = ""; 
                }
              }}
            />
            <Button
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                if (input?.value) {
                  sendMessage(input.value);
                  input.value = ""; 
                }
              }}
              className="bg-transparent flex-1 border border-black h-full text-2xl rounded-xl">
              <BsSendFill className="text-black text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
