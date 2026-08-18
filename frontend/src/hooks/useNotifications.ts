import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { getSocket } from "../utils/socket";
import { getStoredToken } from "../utils/session";

export interface Notification {
  id: number;
  type: "NEW_CHAPTER" | "NEW_COMMENT" | "NEW_MESSAGE" | "NEW_FOLLOWER";
  message: string;
  book_id: number | null;
  chapter_id: number | null;
  read: boolean;
  created_at: string;
  actor: { id: number; name: string; role?: string } | null;
}

interface NotificationsResponse {
  items: Notification[];
  unread: number;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const isSignedIn = Boolean(getStoredToken());

  const query = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: async () => (await newRequest.get("/api/notifications")).data,
    enabled: isSignedIn,
    // a slow safety net; the socket does the real work
    refetchInterval: 2 * 60 * 1000,
  });

  // Live nudge from the server instead of waiting for the next poll.
  useEffect(() => {
    if (!isSignedIn) return;
    const socket = getSocket();
    if (!socket) return;

    const onNew = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
    socket.on("notification:new", onNew);
    return () => {
      socket.off("notification:new", onNew);
    };
  }, [isSignedIn, queryClient]);

  const markRead = useMutation({
    mutationFn: (id: number) => newRequest.patch(`/api/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => newRequest.patch("/api/notifications/read-all"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return {
    items: query.data?.items ?? [],
    unread: query.data?.unread ?? 0,
    isLoading: query.isLoading,
    markRead,
    markAllRead,
  };
};

export default useNotifications;
