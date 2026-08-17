import { twMerge } from "tailwind-merge";
import { formatClock } from "../../utils/helpers";

interface MessageItemProps {
  text: string;
  isMe: boolean;
  senderName: string;
  time: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ text, isMe, senderName, time }) => (
  <div className={`flex mt-4 ${isMe ? "flex-row-reverse" : ""}`}>
    <div className="flex items-end">
      <span
        className={twMerge(
          "size-10 flex justify-center items-center object-cover bg-black rounded-full text-white shrink-0",
          isMe ? "ml-2" : "mr-2"
        )}>
        {(senderName || "?").charAt(0)}
      </span>
    </div>
    <div
      className={`flex p-2 flex-col max-w-[78%] sm:max-w-[70%] ${
        isMe ? "bg-black text-gray-300" : "bg-white"
      } rounded-md`}>
      <div className="flex justify-between gap-3">
        <span className="font-bold">{senderName || "~Anonymous"}</span>
        {/* text-white on a white bubble made this invisible for other people */}
        <span className={`text-sm ${isMe ? "text-gray-300" : "text-gray-500"}`}>
          {formatClock(time)}
        </span>
      </div>
      <span className={`${isMe ? "" : "text-gray-600"} break-words`}>{text}</span>
    </div>
  </div>
);

export default MessageItem;
