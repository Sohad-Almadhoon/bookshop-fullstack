import { useEffect, useState } from "react";
import { useCommentModal } from "../../hooks/useCommentModal";
import newRequest from "../../utils/newRequest";
import Button from "../shared/Button";
import { BsChatFill, BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { useParams } from "react-router-dom";

const ActionButtons = () => {
    const { openModal } = useCommentModal();
    const [following, setFollowing] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await newRequest.get(
                  `/api/books/${id}/book-states`
                );
                setFollowing(response.data.following);
                setLiked(response.data.liked);
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };
        fetchStates();
    }, [id]);

    const handleFollow = async () => {
        try {
            if (following) {
                await newRequest.delete(`/api/books/${id}/follow`);
            } else {
                await newRequest.post(`/api/books/${id}/follow`);
            }
            setFollowing(!following);
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    const handleLike = async () => {
        try {
            if (liked) {
                await newRequest.delete(`/api/books/${id}/like`);
            } else {
                await newRequest.post(`/api/books/${id}/like`);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <div className="flex gap-3 mt-2 items-center">
            <Button
                variant="outline"
                className="flex gap-1 p-1 text-xs justify-center"
                onClick={openModal}>
                <BsChatFill className="text-black text-sm" /> comments
            </Button>

            <Button
                variant={following ? "" : "outline"}
                className="flex gap-1 p-1 text-xs justify-center"
                onClick={handleFollow}>
                <BsPeopleFill className="text-black text-sm" />{" "}
                {following ? "Unfollow" : "Follow"}
            </Button>

            <Button
                variant={liked ? "" : "outline"}
                className="flex gap-1 p-1 px-2 text-xs justify-center"
                onClick={handleLike}>
                <BsHeartFill className="text-black text-sm" />{" "}
                {liked ? "Unlike" : "Like"}
            </Button>
        </div>
    );
};
export default ActionButtons;