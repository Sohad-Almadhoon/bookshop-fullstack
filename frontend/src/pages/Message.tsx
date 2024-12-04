import React, { useState, useEffect } from "react";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";
import { BsSendFill } from "react-icons/bs";
import Header from "../components/shared/Header";
import MessageHeader from "../components/messages/MessageHeader";
import MessageItem from "../components/messages/MessageItem";
import newRequest from "../utils/newRequest";
import { useParams } from "react-router-dom";


const Message: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messageRef = React.useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const currentUser = localStorage.getItem("currentUser");
  const user = currentUser ? JSON.parse(currentUser).user : null;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await newRequest.get(`/api/messages/${id}`);
        const data = response.data;
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [id]); // Empty dependency array to run once when the component mounts

  // Send message to API using POST
  const sendMessage = async () => {
    if (message) {
      try {
        // Post the new message to the API
        const newMessage = {
          content: message,
        };
        await newRequest.post(`/api/messages/${id}`, newMessage);
        const response = await newRequest.get(`/api/messages/${id}`);
        const data = response.data;
        setMessages(data);
        setMessage("");
        messageRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  return (
    <div className="flex flex-col min-h-screen border border-black m-2">
      <Header />
      <div className="border-black flex-1 flex flex-col border lg:mx-16 lg:mt-8">
        <MessageHeader />
        <div className="px-12 flex flex-1 flex-col">
          <div className="flex-1 max-h-[60vh] overflow-auto">
            {messages.map((msg: any) => (
              <MessageItem
                text={msg.content}
                isMe={msg.senderId === user.id}
                senderName={msg.sender.name}
                senderEmail={msg.sender.email}
                key={msg.id}
              />
            ))}

            <div ref={messageRef} />
          </div>
          <div className="flex items-center gap-3">
            <CustomInput
              className="my-5 w-full p-3 flex-3 rounded-xl"
              placeholder="Write a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
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
