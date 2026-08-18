import { useQuery } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";

export interface BookStates {
  liked: boolean;
  followed: boolean;
  isOwner: boolean;
}

/**
 * Shared by the book page, the chapter page and the action buttons, so
 * ownership is fetched once per book instead of once per component.
 */
export const useBookStates = (bookId?: number | string) =>
  useQuery<BookStates>({
    queryKey: ["bookStates", bookId ? String(bookId) : undefined],
    queryFn: async () => (await newRequest.get(`/api/books/${bookId}/book-states`)).data,
    enabled: Boolean(bookId),
  });

export default useBookStates;
