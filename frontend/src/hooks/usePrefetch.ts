import { useQueryClient } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";

/**
 * Warms the cache for a destination while the pointer is still on the link, so
 * the page it opens has its data already and never flashes a placeholder.
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetch = (key: unknown[], url: string) =>
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: async () => (await newRequest.get(url)).data,
      staleTime: 60 * 1000,
    });

  // Keys are stringified because the pages read their id from the URL, where
  // it is always a string. ["book", 1] and ["book", "1"] are different caches.
  const prefetchBook = (id: number | string) => {
    const bookId = String(id);
    prefetch(["book", bookId], `/api/books/${bookId}`);
    prefetch(["chapters", bookId], `/api/books/${bookId}/chapters`);
    prefetch(["bookStates", bookId], `/api/books/${bookId}/book-states`);
  };

  const prefetchChapter = (id: number | string) => {
    const chapterId = String(id);
    prefetch(["chapter", chapterId], `/api/chapters/${chapterId}`);
  };

  return { prefetchBook, prefetchChapter };
};

export default usePrefetch;
