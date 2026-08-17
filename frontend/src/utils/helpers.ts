import { getCurrentUser, SessionUser } from "./session";

export const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

/** Never throws: returns null when there is no valid session. */
export const getUser = (): SessionUser | null => getCurrentUser();

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

const toDate = (value?: string | number | Date | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "12 Mar 2025" - used wherever a creation date is shown. */
export const formatDate = (value?: string | number | Date | null) => {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "—";
};

/** "14:35" - used for message/comment timestamps. */
export const formatClock = (value?: string | number | Date | null) => {
  const date = toDate(value);
  return date ? timeFormatter.format(date) : "";
};

/** "12 Mar 2025, 14:35" */
export const formatDateTime = (value?: string | number | Date | null) => {
  const date = toDate(value);
  return date ? `${dateFormatter.format(date)}, ${timeFormatter.format(date)}` : "—";
};
