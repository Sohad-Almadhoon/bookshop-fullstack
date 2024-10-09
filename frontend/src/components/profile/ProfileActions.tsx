import { twMerge } from "tailwind-merge";
import Button from "../shared/Button";
interface tabProps {
  title: string;
  activeIcon: string;
  icon: string;
  total: number;
}
interface ProfileActionsProps {
  tabs: tabProps[];
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
}
const ProfileActions: React.FC<ProfileActionsProps> = ({
  tabs,
  tab,
  setTab,
}) => {
  return (
    <div className="flex my-4">
      {tabs.map((tabItem, index) => (
        <Button
          key={index}
          className={twMerge(
            "bg-white text-black border flex items-center justify-center gap-2",
            (tab === index) && "bg-black text-white"
          )}
          onClick={() => setTab(index)}>
          <span>
            <img
              src={tab === index ? tabItem.activeIcon : tabItem.icon}
              alt=""
              className="text-black"
            />
          </span>
          <span>{tabItem.title} </span>
          {tabItem.total > 0 && (
            <p
              className={`w-6 h-6 flex justify-center items-center rounded-full text-sm font-semibold ${
                tab === index ? "bg-white text-black" : "bg-black text-white"
              }`}>
              {tabItem.total}
            </p>
          )}
        </Button>
      ))}
    </div>
  );
};
export default ProfileActions;
