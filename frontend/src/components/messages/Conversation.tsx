import { BsChatDotsFill } from "react-icons/bs";

interface ConversationProps {
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
const Conversation: React.FC<ConversationProps> = (props) => {
  return (
    <div className="bg-[#D2C8B5] bg-opacity-30 flex-1 p-2">
      <div className="flex gap-2">
        <img
          src={props.book.image}
          alt="book"
          className="w-12 h-16 object-cover"
        />
        <div className="flex-1 truncate">
          <div className="flex gap-10">
            <h3 className="text-xl font-bold tracking-tighter">
              {props.book.title}
            </h3>
            <div className="flex relative">
              <div className="w-9 h-9 border-black border rounded-full absolute right-5 z-30">
                <img src={props.sender.avatar} alt="" />
              </div>
              <div className="w-9 h-9 border-black border rounded-full absolute right-7 z-10"></div>
              <div className="w-9 h-9 text-lg border-black border rounded-full flex justify-center items-center z-50 bg-[#dfd4bf]">
                65+
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/sender-1.png" alt="" />
            <span className="font-medium">{props.sender.name}</span>
            <BsChatDotsFill className="text-xl text-[#625C51]" />
            <p className="text-gray-500">
              {props.lastMessage.substring(0, 100)}.
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-gray-400 text-xs">{props.time}</span>
          <span className="rounded-full text-white bg-black flex items-center justify-center w-6 h-6">
            {props.unread}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Conversation;
