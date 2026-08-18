import { twMerge } from "tailwind-merge";

interface TabProps {
  title: string;
  activeIcon: string;
  icon: string;
  total: number;
}

interface ProfileActionsProps {
  tabs: TabProps[];
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
}

// A segmented control sized to its content: the tabs used to stretch across the
// full page width, which made two tabs look like a giant toolbar.
const ProfileActions: React.FC<ProfileActionsProps> = ({ tabs, tab, setTab }) => (
  <div
    role="tablist"
    className="my-6 inline-flex max-w-full overflow-hidden rounded-lg border border-black/30">
    {tabs.map((tabItem, index) => {
      const active = tab === index;
      return (
        <button
          key={tabItem.title}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => setTab(index)}
          className={twMerge(
            "flex items-center gap-2 px-4 py-2.5 text-sm uppercase transition-colors sm:px-6",
            active ? "bg-black text-white" : "bg-transparent text-black hover:bg-black/5",
            index > 0 && "border-l border-black/30"
          )}>
          <img
            src={active ? tabItem.activeIcon : tabItem.icon}
            alt=""
            width={20}
            height={20}
          />
          <span className="truncate">{tabItem.title}</span>
          <span
            className={twMerge(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              active ? "bg-white text-black" : "bg-black text-white"
            )}>
            {tabItem.total}
          </span>
        </button>
      );
    })}
  </div>
);

export default ProfileActions;
