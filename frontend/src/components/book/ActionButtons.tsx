import { useCommentModal } from "../../hooks/useCommentModal";
import newRequest from "../../utils/newRequest";
import Button from "../shared/Button";
import { BsChatFill, BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const fetchBookStates = async (id: string) => {
  const response = await newRequest.get(`/api/books/${id}/book-states`);
  return response.data;
};

const ActionButtons = () => {
  const { openModal } = useCommentModal();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isError, error } = useQuery({
    queryKey: ["bookStates", id],
    queryFn: () => fetchBookStates(id as string),
    enabled: !!id,
  });

  const followMutation = useMutation({
    mutationFn: () => (data?.followed ? newRequest.delete(`/api/books/${id}/follow`) : newRequest.post(`/api/books/${id}/follow`)),
    onSuccess: () => {
      toast.success(data?.followed ? "Unfollowed" : "Followed");
      queryClient.invalidateQueries({ queryKey: ["bookStates", id as string] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => (data?.liked ? newRequest.delete(`/api/books/${id}/like`) : newRequest.post(`/api/books/${id}/like`)),
    onSuccess: () => {
      toast.success(data?.liked ? "Unliked" : "Liked");
      queryClient.invalidateQueries({ queryKey: ["bookStates", id] });
    },
  });

  if (isError) {
    console.error("Error fetching states:", error);
    return <div>Error loading book states</div>;
  }

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
          className="flex gap-1 p-1 text-xs justify-center"
          onClick={() => followMutation.mutate()}>
          <BsPeopleFill
            className={twMerge(
              ` text-sm ${data?.followed ? "text-white" : "text-black"}`
            )}
          />{" "}
          {data?.followed ? "Unfollow" : "Follow"}
        </Button>
      )}

      {!data?.isOwner && (
        <Button
          variant={data?.liked ? "" : "outline"}
          className="flex gap-1 p-1 px-2 text-xs justify-center"
          onClick={() => likeMutation.mutate()}>
          <BsHeartFill
            className={twMerge(
              ` text-sm ${data?.liked ? "text-white" : "text-black"}`
            )}
          />{" "}
          {data?.liked ? "Unlike" : "Like"}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
