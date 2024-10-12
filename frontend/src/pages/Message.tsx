import React, { useState } from "react";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";
import { BsSendFill } from "react-icons/bs";
import Header from "../components/shared/Header";
import NewMessagesIndicator from "../components/messages/NewMessagesIndicator";
import MessageHeader from "../components/messages/MessageHeader";
import MessageItem from "../components/messages/MessageItem";

const initialMessages = [
  {
    id: 1,
    isMe: true,
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    isMe: false,
    message:
      "Esed nemo dicta error quas veniam et laboriosam nobis, doloremque aut repellat cumque omnis inventore iste architecto ut fugiat velit similique.Esed nemo dicta error quas veniam et laboriosam nobis, doloremque aut repellat cumque omnis inventore iste architecto ut fugiat velit similique.",
  },
];

const Message: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const messageRef = React.useRef<HTMLDivElement>(null);
  const sendMessage = () => {
    if (message) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          isMe: true,
          message,
        },
      ]);
      setMessage("");
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="flex flex-col min-h-screen border border-black m-2">
      <Header profile />
      <div className="border-black  flex-1 flex flex-col border mx-16 mt-8">
        <MessageHeader />
        <div className="px-12 flex flex-1 flex-col">
          <NewMessagesIndicator />
          <div className="flex-1  max-h-[60vh] overflow-auto">
            {" "}
            {messages.map((msg) => (
              <MessageItem text={msg.message} isMe={msg.isMe} key={msg.id} />
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
