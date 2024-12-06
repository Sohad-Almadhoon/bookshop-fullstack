import { twMerge } from "tailwind-merge";

interface MessageItemProps {
  text: string;
  isMe: boolean;
  senderName: string; // Add sender's name
  time: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  text,
  isMe,
  senderName,
  time,
}) => (
  <div className={`flex mt-4 ${isMe ? "flex-row-reverse" : ""}`}>
    <div className="flex items-end">
      {" "}
      <span
        className={twMerge(
          "size-10  flex justify-center items-center  object-cover bg-black rounded-full text-white",
          isMe ? "ml-2" : "mr-2"
        )}>
        {senderName.charAt(0)}
      </span>
    </div>
    <div
      className={`flex p-2 flex-col flex-1 ${
        isMe ? "bg-black text-gray-300" : "bg-white"
      } rounded-md p-1`}>
      <div className="flex justify-between">
        <span className="font-bold">{senderName || "~Anonymous"}</span>
        <span className="text-sm text-white">
          {" "}
          {new Date(time).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <span className={isMe ? "" : "text-gray-600"}>{text}</span>
    </div>
  </div>
);

export default MessageItem;
