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
    <div className="flex my-4 max-w-full">
      {tabs.map((tabItem, index) => (
        <Button
          key={index}
          className={twMerge(
            " bg-transparent text-black border px-4 border-black border-opacity-30  flex items-center justify-center gap-2",
            tab === index && "bg-black text-white",
            index === 0 ? "rounded-r-none" : "rounded-l-none"
          )}
          onClick={() => setTab(index)}>
          <span>
            <img
              src={tab === index ? tabItem.activeIcon : tabItem.icon}
              alt=""
              width={24}
              height={24}
              className="text-black"
            />
          </span>
          <span>{tabItem.title} </span>
          {tabItem.total > 0 && (
            <p
              className={`w-6 h-6 min-w-6 min-h-6 flex justify-center items-center rounded-full text-sm font-semibold ${
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
