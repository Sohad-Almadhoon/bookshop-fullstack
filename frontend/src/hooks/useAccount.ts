import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { getCurrentUser, patchSessionUser, SessionUser } from "../utils/session";

const fetchMe = async (): Promise<SessionUser> => {
  const { data } = await newRequest.get("/api/users/me");
  return data;
};

/**
 * Always asks the server who the user is and whether they paid.
 * `has_paid` used to be read straight from localStorage, so editing one value
 * in devtools unlocked every paid feature.
 */
export const useAccount = () => {
  const cached = getCurrentUser();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: Boolean(cached),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      patchSessionUser(query.data);
    }
  }, [query.data]);

  return {
    ...query,
    user: query.data ?? cached ?? null,
    // Only trust the server answer; while it loads we assume "not paid".
    hasPaid: Boolean(query.data?.has_paid),
    isChecking: query.isLoading,
  };
};

export default useAccount;
