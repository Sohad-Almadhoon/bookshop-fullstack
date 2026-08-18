import { useQuery } from "@tanstack/react-query";
import GenreTags from "./GenreTags";
import UserBadges from "../shared/UserBadges";
import newRequest, { getErrorMessage } from "../../utils/newRequest";

interface ProfileInfoProps {
  id: number | string;
}

interface ProfileUser {
  id: number;
  name: string;
  role: string;
  generes?: string[];
}

const ProfileInfo = ({ id }: ProfileInfoProps) => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<ProfileUser>({
    queryKey: ["userProfile", id],
    queryFn: async () => (await newRequest.get(`/api/users/${id}`)).data,
    enabled: Boolean(id),
    retry: 1,
  });

  // A generic spinner is a different height from the real card, so the page
  // jumped upwards once the profile arrived. Match the card's own shape.
  if (isLoading) {
    return (
      <div className="border border-opacity-30 border-black rounded-xl p-4 sm:p-8 mt-5 flex lg:flex-row flex-col gap-4 animate-pulse">
        <div className="flex justify-center lg:justify-start">
          <span className="size-20 sm:size-24 rounded-full bg-black/10 shrink-0" />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-8 sm:h-12 w-2/3 rounded bg-black/10" />
          <div className="h-4 w-full rounded bg-black/10" />
          <div className="h-4 w-4/5 rounded bg-black/10" />
        </div>
        <div className="flex flex-col gap-3 shrink-0">
          <div className="h-[68px] w-64 rounded-md bg-black/10" />
          <div className="h-8 w-56 rounded bg-black/10" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-red-600">
        Failed to load user data: {getErrorMessage(error, "Unknown error")}
      </div>
    );
  }

  return (
    <div className="border border-opacity-30 border-black rounded-xl p-4 sm:p-8 mt-5 flex lg:flex-row flex-col gap-4">
      <div className="flex justify-center lg:justify-start">
        <span className="flex uppercase size-20 sm:size-24 text-4xl sm:text-6xl justify-center items-center bg-black text-white rounded-full shrink-0">
          {user.name?.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0 text-center lg:text-start">
        <h1 className="uppercase text-2xl sm:text-3xl lg:text-5xl text-black font-romieMedium mb-3 break-words">
          {user.name} <sub className="text-lg sm:text-2xl">nox</sub>
          <span className="ml-3 align-middle">
            <UserBadges role={user.role} />
          </span>
        </h1>
        <p className="max-w-[640px] mb-3 text-sm font-baskervville">
          I am a dedicated <b className="underline">{user.role}</b> that aspires to be the
          greatest of all time. One becomes part of the art we see and I want people to see
          the taste at its best.
        </p>
      </div>
      <div className="flex flex-col shrink-0">
        {/* The horns hang outside the box, so they only get to exist where
            there is room for them - on phones they pushed the page sideways. */}
        <div className="relative mt-10 lg:mt-0">
          <div className="border border-black px-8 sm:px-16 border-opacity-30 rounded-md text-center text-2xl p-2 z-10 text-black">
            <div className="absolute -left-6 sm:-left-10 top-[-30px] sm:top-[-38px] hidden sm:block">
              <img className="horn-left" src="/assets/horn-left.png" alt=""  width={99} height={69} />
            </div>
            <p className="text-opacity-70 text-black font-cardinal text-3xl sm:text-4xl">
              {user.role}
            </p>
            <div className="absolute -right-6 sm:-right-10 top-[-30px] sm:top-[-38px] hidden sm:block">
              <img className="horn-right" src="/assets/horn-right.png" alt=""  width={99} height={69} />
            </div>
          </div>
        </div>
        <GenreTags tags={user.generes || []} />
      </div>
    </div>
  );
};

export default ProfileInfo;
