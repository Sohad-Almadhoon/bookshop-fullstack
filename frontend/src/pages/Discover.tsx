import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BsSearch, BsX } from "react-icons/bs";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import BookCard from "../components/profile/BookCard";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import { Book } from "../actions/books.action";

interface SearchResult {
  items: (Book & { likes: number })[];
  total: number;
  page: number;
  pages: number;
}

interface Genre {
  name: string;
  count: number;
}

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "A-Z" },
];

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

const Discover: FC = () => {
  // The query lives in the URL, so a search can be shared and survives a refresh.
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const genre = params.get("genre") ?? "";
  const sort = params.get("sort") ?? "newest";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [term, setTerm] = useState(q);

  // Debounced, so typing does not fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      if (term === q) return;
      const next = new URLSearchParams(params);
      if (term) next.set("q", term);
      else next.delete("q");
      next.delete("page");
      setParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: async () => (await newRequest.get("/api/books/genres")).data,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isError, error, isFetching } = useQuery<SearchResult>({
    queryKey: ["library", q, genre, sort, page],
    queryFn: async () =>
      (
        await newRequest.get("/api/books/search", {
          params: { q, genre, sort, page, limit: 24 },
        })
      ).data,
    // Keep the previous results on screen while the next page loads.
    placeholderData: keepPreviousData,
  });

  const books = data?.items ?? [];
  const hasFilters = Boolean(q || genre);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 border border-black p-4 sm:p-6 lg:p-10">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="font-voyage text-3xl uppercase sm:text-4xl">Explore books</h1>
          <p className="mt-1 font-baskervville text-sm text-black/60">
            {data ? `${data.total} ${data.total === 1 ? "book" : "books"}` : "Loading..."}
            {genre && ` in ${genre}`}
            {q && ` matching "${q}"`}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <BsSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search by title or author..."
                aria-label="Search books"
                className="w-full rounded-lg border-2 border-black/40 bg-transparent py-2.5 pl-10 pr-10 outline-none placeholder:text-black/30 focus:border-black"
              />
              {term && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-black/40 hover:text-black">
                  <BsX />
                </button>
              )}
            </div>

            <select
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
              aria-label="Sort books"
              className="rounded-lg border-2 border-black/40 bg-transparent px-3 py-2.5 outline-none focus:border-black">
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => update("genre", "")}
                className={`rounded-full border px-3 py-1 text-xs uppercase transition-colors ${
                  genre
                    ? "border-black/30 hover:bg-black/5"
                    : "border-black bg-black text-[#DDD1BB]"
                }`}>
                All
              </button>
              {genres.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => update("genre", item.name === genre ? "" : item.name)}
                  className={`rounded-full border px-3 py-1 text-xs uppercase transition-colors ${
                    item.name === genre
                      ? "border-black bg-black text-[#DDD1BB]"
                      : "border-black/30 hover:bg-black/5"
                  }`}>
                  {item.name}
                  <span className="ml-1.5 opacity-60">{item.count}</span>
                </button>
              ))}
            </div>
          )}

          <div
            className={`mt-8 ${
              isFetching && !isLoading ? "opacity-60 transition-opacity" : ""
            }`}>
            {isLoading ? (
              <div className={GRID}>
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[3/4] w-full animate-pulse rounded-lg border-2 border-black/20 bg-black/5"
                  />
                ))}
              </div>
            ) : isError ? (
              <p className="text-red-600">
                {getErrorMessage(error, "Could not load books.")}
              </p>
            ) : books.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-baskervville text-lg text-black/60">
                  {hasFilters ? "Nothing matches that search." : "No books yet."}
                </p>
                {hasFilters && (
                  <Button
                    variant="outline"
                    className="mx-auto mt-4 w-fit px-5 py-2 text-sm"
                    onClick={() => setParams(new URLSearchParams())}>
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className={GRID}>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} likes={book.likes} />
                ))}
              </div>
            )}
          </div>

          {data && data.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                className="w-fit px-4 py-2 text-sm"
                disabled={page <= 1}
                onClick={() => update("page", String(page - 1))}>
                Previous
              </Button>
              <span className="text-sm">
                Page {data.page} of {data.pages}
              </span>
              <Button
                variant="outline"
                className="w-fit px-4 py-2 text-sm"
                disabled={page >= data.pages}
                onClick={() => update("page", String(page + 1))}>
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discover;
