import { twMerge } from "tailwind-merge";

interface MessageItemProps {
  text: string;
  isMe: boolean;
  senderName: string; // Add sender's name
  senderEmail: string; // Add sender's email or any other details you want
}

const MessageItem: React.FC<MessageItemProps> = ({
  text,
  isMe,
  senderName,
  senderEmail,
}) => (
  <div className={`flex mt-4 ${isMe ? "flex-row-reverse" : ""}`}>
    <span
      className={twMerge(
        "size-10  flex justify-center items-end object-cover bg-black rounded-full text-white"
      , isMe ?"ml-2" : "mr-2")}>
      {senderName.charAt(0)}
    </span>
    <div
      className={`flex p-2 flex-col flex-1 ${
        isMe ? "bg-black text-gray-300" : "bg-white"
      } rounded-md p-1`}>
      {!isMe && (
        <div className="flex justify-between">
          <span className="font-bold">{senderName || "~Anonymous"}</span>
          <span className="text-sm text-gray-400">{senderEmail}</span>
        </div>
      )}
      <span className={isMe ? "" : "text-gray-600"}>{text}</span>
    </div>
  </div>
);

export default MessageItem;
