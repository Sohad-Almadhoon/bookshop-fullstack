interface MessageItemProps {
  text: string;
  isMe: boolean;
}
const MessageItem: React.FC<MessageItemProps> = ({ text, isMe }) => (
  <div className={`flex mt-4 ${isMe ? "flex-row-reverse" : ""}`}>
    <div className={`self-end ${isMe ? "ml-2" : "mr-2"}`}>
      <img
        src={isMe ? "/assets/sender-1.png" : "/assets/sender-2.png"}
        alt="sender"
        className="w-10 h-10 object-cover"
      />
    </div>
    <div
      className={`flex p-2 flex-col flex-1 ${
        isMe ? "bg-black text-gray-300" : "bg-white"
      } rounded-md p-1`}>
      {!isMe && (
        <div className="flex justify-between">
          <span className="font-bold">{!isMe && "~Emaily89"}</span>
          <span className="text-sm text-gray-400">14:22</span>
        </div>
      )}
      <span className={isMe ? "" : "text-gray-600"}>{text}</span>
    </div>
  </div>
);
export default MessageItem;
