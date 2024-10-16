import Button from "../shared/Button";
import GenreTags from "./GenreTags";
import ProfileStats from "./ProfileStats";

const ProfileInfo: React.FC = () => (
  <div className="border border-gray-400 rounded-md text-gray-500 p-5 mt-5 flex gap-4">
    <div>
      <img src="/assets/collection-thumbnail.png" alt="profile-img" />
    </div>
    <div className="flex-1">
      <h1 className="uppercase text-5xl text-black font-light mb-3">
        andrew <sub className="text-3xl">nox</sub>
      </h1>
      <p className="max-w-[640px] mb-3">
        I am a dedicated writer that aspires to be the greatest of all time. One
        becomes part of the art we see and I want people to see the taste at its
        best.
      </p>
      <div className="flex items-center gap-2">
        <Button className="w-[200px] rounded-md">follow</Button>
        <ProfileStats following={705} followers={900} />
      </div>
    </div>
    <div className="flex flex-col">
      <div className="relative">
        {" "}
        <div className="border rounded-md text-center text-2xl p-2 relative bg-transparent  text-black">
          <div className="absolute left-12 top-[-48px] -z-10">
            <img
              className="horn-left "
              src="/assets/horn-left.png"
              alt="Horn Left"
            />
          </div>
          TOTAL IP: $8400
          <div className="absolute right-0 top-[-38px] -z-10">
            <img
              className="horn-right"
              src="/assets/horn-right.png"
              alt="Horn Right"
            />
          </div>
        </div>
      </div>
      <GenreTags tags={["#HORROR", "#SCL-F1", "#EROTIC"]} />
    </div>
  </div>
);
export default ProfileInfo;
