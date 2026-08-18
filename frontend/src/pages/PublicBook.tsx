import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BsBook, BsCalendar2, BsHeartFill, BsLock, BsPeopleFill } from "react-icons/bs";
import Button from "../components/shared/Button";
import Loader from "../components/shared/Loader";
import UserBadges from "../components/shared/UserBadges";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import { formatDate } from "../utils/helpers";
import { getStoredToken } from "../utils/session";

interface PublicBook {
  id: number;
  title: string;
  author: string;
  description: string;
  main_cover: string;
  generes: string[];
  created_at: string;
  owner: { id: number; name: string; role?: string } | null;
  chapters: { id: number; title: string; cover_image: string }[];
  likes: number;
  follows: number;
}

/**
 * The one page that can be handed to someone without an account: cover,
 * description and chapter titles, but never the writing itself.
 */
const PublicBookPage = () => {
  const { id } = useParams();
  const isSignedIn = Boolean(getStoredToken());

  const { data, isLoading, isError, error } = useQuery<PublicBook>({
    queryKey: ["publicBook", id],
    queryFn: async () => (await newRequest.get(`/api/public/books/${id}`)).data,
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#DDD1BB]">
        <Loader />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#DDD1BB] px-4 text-center font-romie">
        <h1 className="font-voyage text-4xl uppercase">Book not found</h1>
        <p className="text-black/60">
          {getErrorMessage(error, "This book may have been removed.")}
        </p>
        <Link to="/">
          <Button className="w-fit px-6 py-2 text-sm">Go to Block Book</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DDD1BB] p-2 font-romie">
      <header className="flex items-center justify-between border border-black p-2 lg:px-8">
        <Link to="/" aria-label="Block Book home">
          <img
            src="/assets/logo-dark.svg"
            alt="Block Book"
            width={63}
            height={88}
            className="w-11 sm:w-14"
          />
        </Link>
        <Link to={isSignedIn ? `/books/${data.id}` : "/register"}>
          <Button className="w-fit px-5 py-2 text-sm">
            {isSignedIn ? "Open in Block Book" : "Join to read"}
          </Button>
        </Link>
      </header>

      <main className="border border-black p-4 sm:p-6 lg:p-10">
        <div className="mx-auto w-full max-w-5xl">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-10">
            <img
              src={data.main_cover}
              alt={`${data.title} cover`}
              className="mx-auto aspect-[3/4] w-full max-w-[300px] rounded-xl border-2 border-black object-cover lg:mx-0"
            />

            <div className="min-w-0">
              <h1 className="font-voyage text-3xl uppercase leading-tight sm:text-4xl">
                {data.title}
              </h1>
              <p className="mt-1 font-baskervville text-sm text-black/60">by {data.author}</p>

              {data.owner && (
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-black/50">Created by</span>
                  <span className="font-romieMedium">{data.owner.name}</span>
                  <UserBadges role={data.owner.role} isOwner />
                </p>
              )}

              {data.generes?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.generes.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-md bg-black px-2 py-1 text-xs text-white">
                      #{genre}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-4 max-w-2xl font-baskervville leading-relaxed text-black/80">
                {data.description}
              </p>

              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <BsCalendar2 />
                  <dd>{formatDate(data.created_at)}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <BsBook />
                  <dd>
                    {data.chapters.length}{" "}
                    {data.chapters.length === 1 ? "chapter" : "chapters"}
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <BsHeartFill className="text-red-700" />
                  <dd>{data.likes}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <BsPeopleFill />
                  <dd>{data.follows}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="flex items-center gap-3 rounded-lg bg-black px-5 py-3 font-voyage text-xl uppercase text-white sm:text-2xl">
              Chapters
            </h2>

            {data.chapters.length === 0 ? (
              <p className="mt-5 text-center font-baskervville text-black/60">
                No chapters published yet.
              </p>
            ) : (
              <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {data.chapters.map((chapter) => (
                  <li key={chapter.id} className="relative">
                    <div className="overflow-hidden rounded-lg border-2 border-black">
                      <div className="relative aspect-[3/4] w-full bg-black/5">
                        <img
                          src={chapter.cover_image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        {/* the writing itself never reaches this page */}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-2xl text-white opacity-0 transition-opacity hover:opacity-100">
                          <BsLock />
                        </span>
                      </div>
                      <p className="truncate border-t-2 border-black bg-[#cfc5b0] px-2 py-1.5 text-center text-sm">
                        {chapter.title}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-12 rounded-xl border-2 border-black p-6 text-center sm:p-10">
            <h2 className="font-voyage text-2xl uppercase sm:text-3xl">
              Read it, or write the next chapter
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-baskervville text-black/70">
              Block Book is written by the people reading it. Create an account to read this
              book, follow it, and join the conversation around it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to={isSignedIn ? `/books/${data.id}` : "/register"}>
                <Button className="w-fit px-6 py-2 text-sm">
                  {isSignedIn ? "Open in Block Book" : "Create an account"}
                </Button>
              </Link>
              {!isSignedIn && (
                <Link to="/login">
                  <Button variant="outline" className="w-fit px-6 py-2 text-sm">
                    I already have one
                  </Button>
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PublicBookPage;
