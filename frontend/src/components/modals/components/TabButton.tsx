import { FC } from "react";
import Button from "../../shared/Button";
import { twMerge } from "tailwind-merge";
interface TabButtonProps {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  index?: number;
}

const TabButton: FC<TabButtonProps> = ({
  index,
  title,
  Icon,
  active,
  onClick,
}) => (
  <Button
    onClick={onClick}
    className={twMerge(
      "flex items-center py-3 px-6 text-xl gap-2",
      index === 0
        ? "rounded-r-none"
        : index === 1
        ? "rounded-r-none rounded-l-none"
        : "rounded-l-none"
    )}
    variant={active ? "" : "outline"}>
    <Icon className="w-6 h-6" />
    {title}
  </Button>
);
export default TabButton; 