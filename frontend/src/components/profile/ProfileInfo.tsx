import { useEffect, useState } from "react";
import Button from "../shared/Button";
import GenreTags from "./GenreTags";
import ProfileStats from "./ProfileStats";
import newRequest from "../../utils/newRequest";

const ProfileInfo = ({ id }: { id: string }) => {
  const [user, setUser] = useState<any>(null); // State to store user info
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    // Fetch user information from the server
    const fetchUserInfo = async () => {
      try {
        const response = await newRequest.get(`/api/users/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="border border-opacity-30 border-black rounded-xl p-8 mt-5 flex gap-4">
      <div>
        <img src="/assets/collection-thumbnail.png" alt="profile-img" />
      </div>
      <div className="flex-1">
        <h1 className="uppercase text-5xl text-black font-romieMedium mb-3">
          {user.name} <sub className="text-2xl">nox</sub>
        </h1>
        <p className="max-w-[640px] mb-3 text-sm font-baskervville">
          I am a dedicated writer that aspires to be the greatest of all time.
          One becomes part of the art we see and I want people to see the taste
          at its best.
        </p>
        <div className="flex items-center gap-2">
          <Button className="w-[200px] rounded-md">follow</Button>
          <ProfileStats
            following={user.following_users.length}
            followers={user.followers.length}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className=" relative">
          {" "}
          <div className="border border-black border-opacity-30 rounded-md text-center text-2xl p-2 z-10 text-black">
            <div className="absolute -left-10 top-[-38px]">
              <img
                className="horn-left "
                src="/assets/horn-left.png"
                alt="Horn Left"
              />
            </div>
            <p className=" text-opacity-70 text-black">TOTAL IP: $8400</p>
            <div className="absolute -right-10 top-[-38px]">
              <img
                className="horn-right"
                src="/assets/horn-right.png"
                alt="Horn Right"
              />
            </div>
          </div>
        </div>
        <GenreTags tags={user.generes} />
      </div>
    </div>
  );
};
export default ProfileInfo;
