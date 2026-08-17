export interface SessionUser {
  id: number;
  name: string;
  email?: string;
  role: string;
  generes?: string[];
  has_paid?: boolean;
  created_at?: string;
}

export interface Session {
  token: string;
  user: SessionUser;
}

const STORAGE_KEY = "currentUser";

/**
 * Single reader for the stored session. Returns null instead of throwing when
 * the entry is missing or corrupted (JSON.parse used to crash whole pages).
 */
export const getSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) return null;
    return parsed as Session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const getStoredToken = (): string | null => getSession()?.token ?? null;

export const getCurrentUser = (): SessionUser | null => getSession()?.user ?? null;

export const setSession = (session: Session): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

/** Merge fresh fields (e.g. has_paid) into the cached user. */
export const patchSessionUser = (patch: Partial<SessionUser>): void => {
  const session = getSession();
  if (!session) return;
  setSession({ ...session, user: { ...session.user, ...patch } });
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
