import { useParams } from "react-router-dom";
import { BsChatFill, BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { useCommentModal } from "../../hooks/useCommentModal";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import Button from "../shared/Button";

interface BookStates {
  liked: boolean;
  followed: boolean;
  isOwner: boolean;
}

const ActionButtons = () => {
  const { openModal } = useCommentModal();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isError, error } = useQuery<BookStates>({
    queryKey: ["bookStates", id],
    queryFn: async () => (await newRequest.get(`/api/books/${id}/book-states`)).data,
    enabled: Boolean(id),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["bookStates", id] });
    queryClient.invalidateQueries({ queryKey: ["bookStats", Number(id)] });
    queryClient.invalidateQueries({ queryKey: ["followingBooks"] });
  };

  const followMutation = useMutation({
    mutationFn: () =>
      data?.followed
        ? newRequest.delete(`/api/books/${id}/follow`)
        : newRequest.post(`/api/books/${id}/follow`),
    onSuccess: () => {
      toast.success(data?.followed ? "Unfollowed" : "Followed");
      refresh();
    },
    // Errors were silently swallowed before.
    onError: (error) => toast.error(getErrorMessage(error, "Could not update follow state.")),
  });

  const likeMutation = useMutation({
    mutationFn: () =>
      data?.liked
        ? newRequest.delete(`/api/books/${id}/like`)
        : newRequest.post(`/api/books/${id}/like`),
    onSuccess: () => {
      toast.success(data?.liked ? "Unliked" : "Liked");
      refresh();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update like state.")),
  });

  if (isError) {
    return (
      <div className="text-sm text-red-600 mt-2">
        {getErrorMessage(error, "Error loading book states")}
      </div>
    );
  }

  const isBusy = followMutation.isPending || likeMutation.isPending;

  return (
    <div className="flex gap-3 mt-2 items-center">
      <Button
        variant="outline"
        className="flex gap-1 p-1 text-xs justify-center"
        onClick={openModal}>
        <BsChatFill className="text-black text-sm" /> comments
      </Button>

      {!data?.isOwner && (
        <Button
          variant={data?.followed ? "" : "outline"}
          disabled={isBusy}
          className="flex gap-1 p-1 text-xs justify-center"
          onClick={() => followMutation.mutate()}>
          <BsPeopleFill
            className={twMerge(`text-sm ${data?.followed ? "text-white" : "text-black"}`)}
          />{" "}
          {data?.followed ? "Unfollow" : "Follow"}
        </Button>
      )}

      {!data?.isOwner && (
        <Button
          variant={data?.liked ? "" : "outline"}
          disabled={isBusy}
          className="flex gap-1 p-1 px-2 text-xs justify-center"
          onClick={() => likeMutation.mutate()}>
          <BsHeartFill
            className={twMerge(`text-sm ${data?.liked ? "text-white" : "text-black"}`)}
          />{" "}
          {data?.liked ? "Unlike" : "Like"}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
