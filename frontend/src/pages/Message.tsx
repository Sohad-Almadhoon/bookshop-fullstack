import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BsSendFill } from "react-icons/bs";
import toast from "react-hot-toast";
import CustomInput from "../components/shared/CustomInput";
import Button from "../components/shared/Button";
import Header from "../components/shared/Header";
import MessageHeader from "../components/messages/MessageHeader";
import MessageItem from "../components/messages/MessageItem";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import Loader from "../components/shared/Loader";
import { getCurrentUser } from "../utils/session";
import { getSocket } from "../utils/socket";

interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  sender: { id: number; name: string; role?: string };
}

interface ConversationData {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
    main_cover: string;
    // the book's creator, so their messages can be marked in the thread
    users?: { user: { id: number; name: string; role: string } }[];
  } | null;
}

const Message: React.FC = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  // Fetched from the API instead of router state, so a refresh no longer
  // crashes the header with "cannot read property id of undefined".
  const { data: conversation } = useQuery<ConversationData>({
    queryKey: ["conversation", id],
    queryFn: async () => (await newRequest.get(`/api/conversations/${id}`)).data,
    enabled: Boolean(id),
  });

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
  } = useQuery<ChatMessage[]>({
    queryKey: ["messages", id],
    queryFn: async () => {
      const response = await newRequest.get(`/api/messages/${id}`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: Boolean(id),
  });

  const bookOwnerId = conversation?.book?.users?.[0]?.user?.id;

  // Live thread: messages used to appear only when you sent one yourself or
  // reloaded the page.
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !id) return;

    const join = () => socket.emit("conversation:join", Number(id));
    join();
    socket.on("connect", join);

    const onMessage = (incoming: ChatMessage) => {
      queryClient.setQueryData<ChatMessage[]>(["messages", id], (old = []) =>
        // the sender already has it from their own request
        old.some((m) => m.id === incoming.id) ? old : [...old, incoming]
      );
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };
    socket.on("message:new", onMessage);

    return () => {
      socket.emit("conversation:leave", Number(id));
      socket.off("message:new", onMessage);
      socket.off("connect", join);
    };
  }, [id, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const mutation = useMutation({
    mutationFn: (content: string) =>
      newRequest.post(`/api/messages/${id}`, { content }),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Message could not be sent.")),
  });

  const sendMessage = () => {
    const content = draft.trim();
    if (!content) return;
    mutation.mutate(content);
  };

  return (
    <div className="flex flex-col min-h-screen border border-black m-1 sm:m-2">
      <Header />
      <div className="border-black flex-1 flex flex-col border sm:mx-4 lg:mx-16 sm:mt-4 lg:mt-8">
        <MessageHeader book={conversation?.book ?? null} />
        <div className="px-4 lg:px-12 flex flex-1 flex-col">
          <div className="flex-1 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto">
            {isLoading && <Loader />}
            {isError && (
              <div className="text-red-600 mt-4">
                {getErrorMessage(error, "Error loading messages.")}
              </div>
            )}
            {!isLoading && !isError && messages.length === 0 && (
              <p className="text-center text-gray-500 mt-5">
                No messages yet. Say hello!
              </p>
            )}
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                text={msg.content}
                isMe={msg.senderId === currentUser?.id}
                senderName={msg.sender?.name || "Anonymous"}
                role={msg.sender?.role}
                isBookOwner={Boolean(bookOwnerId) && msg.senderId === bookOwnerId}
                // was msg.sender.created_at: the sender's signup date
                time={msg.createdAt}
              />
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <CustomInput
              className="my-5 w-full min-w-0 flex-1 p-3 rounded-xl"
              placeholder="Write a message"
              value={draft}
              maxLength={2000}
              disabled={mutation.isPending}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={mutation.isPending || !draft.trim()}
              aria-label="Send message"
              // was flex-1: the send button used to take half of a phone screen
              className="bg-transparent w-auto shrink-0 border border-black px-4 py-3 text-2xl rounded-xl">
              <BsSendFill className="text-black text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
