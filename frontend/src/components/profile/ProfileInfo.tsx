import { useQuery } from "@tanstack/react-query";
import GenreTags from "./GenreTags";
import newRequest from "../../utils/newRequest";
import Loader from "../shared/Loader";

interface ProfileInfoProps {
  id: string;
}

const ProfileInfo = ({ id }: ProfileInfoProps) => {
const fetchUserInfo = async (id: string) => {
  const response = await newRequest.get(`/api/users/${id}`);
  return response.data;
};
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => fetchUserInfo(id),
    enabled: !!id,
    retry: 1,
  });
  console.log("Fetched user data:", user);
  if (isLoading) {
    return <Loader/>;
  }
  console.log(user)
  if (error instanceof Error) {
    return <div>Failed to load user data: {error.message}</div>;
  }

  return (
    <div className="border border-opacity-30 border-black rounded-xl p-8 mt-5 flex gap-4">
      <div>
        <span className="flex uppercase size-24 text-6xl justify-center items-center bg-black text-white rounded-full">
          {user?.name?.charAt(0)}
        </span>
      </div>
      <div className="flex-1">
        <h1 className="uppercase text-5xl text-black font-romieMedium mb-3">
          {user?.name} <sub className="text-2xl">nox</sub>
        </h1>
        <p className="max-w-[640px] mb-3 text-sm font-baskervville">
          I am a dedicated writer that aspires to be the greatest of all time.
          One becomes part of the art we see and I want people to see the taste
          at its best.
        </p>
      </div>
      <div className="flex flex-col">
        <div className=" relative">
          <div className="border border-black border-opacity-30 rounded-md text-center text-2xl p-2 z-10 text-black">
            <div className="absolute -left-10 top-[-38px]">
              <img
                className="horn-left"
                src="/assets/horn-left.png"
                alt="Horn Left"
              />
            </div>
            <p className=" text-opacity-70 text-black font-cardinal text-4xl">
               {user.role}
            </p>
            <div className="absolute -right-10 top-[-38px]">
              <img
                className="horn-right"
                src="/assets/horn-right.png"
                alt="Horn Right"
              />
            </div>
          </div>
        </div>
        <GenreTags tags={user?.generes || []} />
      </div>
    </div>
  );
};

export default ProfileInfo;
