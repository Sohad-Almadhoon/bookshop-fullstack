import React from "react";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";
import { BsSendFill } from "react-icons/bs";
import Header from "../components/shared/Header";

interface MessageBubbleProps {
  sender: string;
  time?: string;
  text: string;
  isSender: boolean;
  senderImage: string;
}

const MessageHeader: React.FC = () => (
  <div className="flex justify-between h-24 items-center border-b px-12 border-black">
    <div className="flex items-center gap-2">
      <span>⬅️</span>
      <img
        src="/assets/book-1.png"
        alt="book"
        className="w-12 h-16 object-cover"
      />
      <div>
        <h3 className="text-2xl">The Watering Hole</h3>
        <span className="text-xs text-gray-600">
          We should talk more about this novel
        </span>
      </div>
    </div>
    <div className="flex items-center">
      <div className="flex items-center relative">
        <div className="w-12 h-12 border-black border rounded-full absolute right-9 z-30">
          <img src="/assets/profile.png" alt="profile" />
        </div>
        <div className="w-12 h-12 border-black border rounded-full absolute right-14 z-10"></div>
        <div className="w-12 h-12 text-lg border-black border rounded-full flex justify-center items-center z-50 bg-[#dfd4bf]">
          65+
        </div>
      </div>
      <span>📃</span>
    </div>
  </div>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  time,
  text,
  isSender,
  senderImage,
}) => (
  <div className={`flex mt-4 ${isSender ? "flex-row-reverse" : ""}`}>
    <div className={`self-end ${isSender ? "ml-2" : "mr-2"}`}>
      <img src={senderImage} alt="sender" className="w-10 h-10 object-cover" />
    </div>
    <div
      className={`flex flex-col flex-1 ${
        isSender ? "bg-black text-gray-300" : "bg-white"
      } rounded-md p-1`}>
      {!isSender && (
        <div className="flex justify-between">
          <span>{sender}</span>
          <span className="text-sm text-gray-400">{time}</span>
        </div>
      )}
      <span className={isSender ? "" : "text-gray-600"}>{text}</span>
    </div>
  </div>
);

const NewMessagesIndicator: React.FC = () => (
  <div className="border-black border uppercase flex items-center rounded-md w-fit mx-auto mt-3 mb-4 p-1 gap-1">
    <img src="/assets/message.svg" alt="message" />
    99+ new messages
  </div>
);

const Message: React.FC = () => {
  return (
    <div className="bg-[#dfd4bf] min-h-screen border border-black m-2">
      <Header/>
      <div className="border-black border mx-16 mt-8">
        <MessageHeader />
        <div className="px-12">
          <NewMessagesIndicator />
          <MessageBubble
            sender=""
            text="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
            isSender={true}
            senderImage="/assets/sender-1.png"
          />
          <MessageBubble
            sender="~Emily89"
            time="11:24"
            text="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil molestias itaque et illo! Ad, eum. Quisquam, optio ab quos officia minus beatae. Veritatis neque incidunt unde tempore aspernatur? Eos, eaque."
            isSender={false}
            senderImage="/assets/sender-2.png"
          />
          <MessageBubble
            sender=""
            text="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil molestias itaque et illo! Eos, eaque."
            isSender={true}
            senderImage="/assets/sender-1.png"
          />
          <MessageBubble
            sender="~Emily89"
            time="11:24"
            text="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil molestias itaque et illo! Ad, eum. Quisquam, optio ab quos officia minus beatae. Veritatis neque incidunt unde tempore aspernatur? Eos, eaque."
            isSender={false}
            senderImage="/assets/sender-2.png"
          />
          <MessageBubble
            sender="~Emily89"
            time="11:24"
            text="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil molestias itaque et illo! Ad, eum."
            isSender={false}
            senderImage="/assets/sender-2.png"
          />
          <div className="flex items-center gap-3">
            <CustomInput
              className="my-5 w-full p-3 flex-3 rounded-xl"
              placeholder="Write a message"
            />
            <Button className="bg-transparent flex-1 border border-black h-full text-2xl rounded-xl">
              <BsSendFill className="text-black text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
