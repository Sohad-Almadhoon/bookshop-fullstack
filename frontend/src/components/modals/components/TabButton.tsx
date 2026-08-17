import { FC } from "react";
import Button from "../../shared/Button";
import { twMerge } from "tailwind-merge";

interface TabButtonProps {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  index?: number;
  onClick?: () => void;
  disabled?: boolean;
}

// The tabs had no click handler at all, so the modal could never switch tabs.
const TabButton: FC<TabButtonProps> = ({ index, title, Icon, active, onClick, disabled }) => (
  <Button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={active}
    className={twMerge(
      // px-6/text-xl blew past 375px once three tabs sat side by side
      "flex items-center justify-center py-2 sm:py-3 px-2 sm:px-6 text-sm sm:text-lg lg:text-xl gap-1 sm:gap-2 cursor-pointer",
      index === 0
        ? "rounded-r-none"
        : index === 1
        ? "rounded-r-none rounded-l-none"
        : "rounded-l-none"
    )}
    variant={active ? "" : "outline"}>
    <Icon className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" />
    <span className="truncate">{title}</span>
  </Button>
);

export default TabButton;
