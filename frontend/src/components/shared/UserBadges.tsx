import { ReactNode } from "react";
import { BsBook, BsBrush, BsEyeglasses, BsKey, BsMusicNoteBeamed, BsPen } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

type Tone = "role" | "owner";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  title?: string;
}

const TONES: Record<Tone, string> = {
  role: "border-black/25 bg-black/[0.04] text-black/70",
  owner: "border-black bg-black text-[#DDD1BB]",
};

export const Badge: React.FC<BadgeProps> = ({ children, tone = "role", icon, title }) => (
  <span
    title={title}
    className={twMerge(
      "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase leading-none tracking-wide",
      TONES[tone]
    )}>
    {icon}
    {children}
  </span>
);

// The four roles the questionnaire offers, plus a fallback for anything else.
const ROLE_ICONS: Record<string, ReactNode> = {
  writer: <BsPen />,
  reader: <BsEyeglasses />,
  musician: <BsMusicNoteBeamed />,
  "visual artist": <BsBrush />,
};

interface UserBadgesProps {
  role?: string | null;
  isOwner?: boolean;
  /** Hide the role when space is tight, e.g. in a dense message list. */
  showRole?: boolean;
}

/**
 * The badges shown next to a name. "Owner" is derived from the data (who holds
 * the book's ALL relation); the role is self-declared at sign-up.
 */
const UserBadges: React.FC<UserBadgesProps> = ({ role, isOwner, showRole = true }) => {
  if (!isOwner && (!showRole || !role)) return null;

  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {isOwner && (
        <Badge tone="owner" icon={<BsKey />} title="Created this book">
          Owner
        </Badge>
      )}
      {showRole && role && (
        <Badge icon={ROLE_ICONS[role.toLowerCase()] ?? <BsBook />} title={`Signed up as a ${role}`}>
          {role}
        </Badge>
      )}
    </span>
  );
};

export default UserBadges;
