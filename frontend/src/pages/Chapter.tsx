import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsChevronLeft, BsMusicNoteBeamed, BsTrash } from "react-icons/bs";
import toast from "react-hot-toast";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { useNovelModal } from "../hooks/useNovelModal";
import VoicePlayer from "../components/shared/VoicePlayer";
import TextBlocks from "../components/chapter/TextBlocks";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import Loader from "../components/shared/Loader";
import useBookStates from "../hooks/useBookStates";
import useAccount from "../hooks/useAccount";

interface ChapterData {
  id: number;
  title: string;
  cover_image: string;
  book_id: number;
  book: { id: number; title: string; author: string };
  chapter_content: { text: string[]; audio: string | null } | null;
}

const ChapterPage: React.FC = () => {
  const { openModal } = useNovelModal();
  const { id: chapterId } = useParams();
  const queryClient = useQueryClient();
  const [confirmAudio, setConfirmAudio] = useState(false);

  const {
    data: chapter,
    isLoading,
    isError,
    error,
  } = useQuery<ChapterData>({
    queryKey: ["chapter", chapterId],
    queryFn: async () => (await newRequest.get(`/api/chapters/${chapterId}`)).data,
    enabled: Boolean(chapterId),
  });

  const { data: states } = useBookStates(chapter?.book_id);
  const { hasPaid } = useAccount();

  const isOwner = Boolean(states?.isOwner);
  const canWrite = isOwner || hasPaid;

  const deleteAudio = useMutation({
    mutationFn: () => newRequest.delete(`/api/chapters/${chapterId}/content/audio`),
    onSuccess: () => {
      toast.success("Audio removed");
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      setConfirmAudio(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not remove the audio."));
      setConfirmAudio(false);
    },
  });

  if (isLoading) return <Loader />;

  if (isError || !chapter) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-xl">Error loading chapter</p>
        <p className="text-sm text-gray-700">
          {getErrorMessage(error, "This chapter could not be loaded.")}
        </p>
      </div>
    );
  }

  const audio = chapter.chapter_content?.audio;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 border border-black p-4 sm:p-6 lg:p-10">
        <Link
          to={`/books/${chapter.book_id}`}
          className="inline-flex items-center gap-2 text-sm underline underline-offset-4">
          <BsChevronLeft /> Back to {chapter.book?.title}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12">
          {/* left rail: cover + audio, sticky on wide screens */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <img
              src={chapter.cover_image}
              alt=""
              className="aspect-[3/4] w-full max-w-[320px] rounded-xl border-2 border-black object-cover mx-auto lg:mx-0"
            />

            <div className="mt-4">
              {audio ? (
                <div className="flex items-center gap-2 rounded-xl border border-black/30 p-2">
                  <VoicePlayer url={audio} />
                  {isOwner && (
                    <button
                      type="button"
                      aria-label="Remove audio"
                      onClick={() => setConfirmAudio(true)}
                      className="shrink-0 rounded-full border border-black/30 p-2 hover:bg-red-800 hover:text-white">
                      <BsTrash />
                    </button>
                  )}
                </div>
              ) : canWrite ? (
                <Button
                  onClick={() => openModal("audio")}
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 py-2 text-sm">
                  <BsMusicNoteBeamed /> Add audio
                </Button>
              ) : (
                <p className="text-center text-sm text-black/50">
                  No audio for this chapter.
                </p>
              )}
            </div>
          </aside>

          <section className="min-w-0">
            <h1 className="mb-6 font-voyage text-3xl uppercase leading-tight sm:text-4xl">
              {chapter.title}
            </h1>

            <TextBlocks
              chapterId={chapterId!}
              blocks={chapter.chapter_content?.text ?? []}
              canWrite={canWrite}
              isOwner={isOwner}
            />
          </section>
        </div>
      </main>

      <ConfirmDialog
        open={confirmAudio}
        loading={deleteAudio.isPending}
        title="Remove the audio?"
        description="The audio block will be removed from this chapter."
        confirmLabel="Remove audio"
        onConfirm={() => deleteAudio.mutate()}
        onClose={() => setConfirmAudio(false)}
      />
    </div>
  );
};

export default ChapterPage;
