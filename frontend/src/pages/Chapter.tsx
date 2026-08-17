import { useParams } from "react-router-dom";
import { BsFileText, BsMusicNoteBeamed } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import { useNovelModal } from "../hooks/useNovelModal";
import VoicePlayer from "../components/shared/VoicePlayer";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import Loader from "../components/shared/Loader";

interface ChapterData {
  id: number;
  title: string;
  cover_image: string;
  book_id: number;
  book: { id: number; title: string; author: string };
  chapter_content: { text: string[]; audio: string | null } | null;
}

interface IconButtonProps {
  icon: React.ElementType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, onClick, label }) => (
  <Button
    onClick={onClick}
    className="flex items-center justify-center gap-x-3 my-5 max-w-sm w-full mx-auto">
    <Icon className="text-lg" />
    {label}
  </Button>
);

// Looked up by chapter id alone: the page used to depend on router state and
// broke on refresh or when the URL was opened directly.
const fetchChapter = async (chapterId: string): Promise<ChapterData> => {
  const response = await newRequest.get(`/api/chapters/${chapterId}`);
  return response.data;
};

const ChapterPage: React.FC = () => {
  const { openModal } = useNovelModal();
  const { id: chapterId } = useParams();

  const {
    data: chapter,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => fetchChapter(chapterId!),
    enabled: Boolean(chapterId),
  });

  if (isLoading) return <Loader />;

  if (isError || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-xl">Error loading chapter</p>
        <p className="text-sm text-gray-700">
          {getErrorMessage(error, "This chapter could not be loaded.")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen border border-black">
      <Header
        title={
          <h3 className="text-3xl uppercase font-romieMedium">{chapter.book?.title}</h3>
        }
      />
      <div className="flex lg:flex-row flex-col">
        <div className="flex-1 border-r border-black">
          <div className="flex flex-col items-center justify-center mt-6 sm:mt-9 px-3">
            <img
              src={chapter.cover_image}
              alt={`${chapter.title} cover`}
              className="h-64 sm:h-80 lg:h-[420px] max-w-lg w-full object-cover border-black border rounded-2xl"
            />

            <div className="flex p-2 mt-5 gap-3 w-full max-w-lg border-black border border-opacity-30 rounded-2xl items-center">
              {chapter.chapter_content?.audio ? (
                <VoicePlayer url={chapter.chapter_content.audio} />
              ) : (
                <p>No audio available for this chapter.</p>
              )}
            </div>
            {!chapter.chapter_content?.audio && (
              <IconButton
                onClick={() => openModal("audio")}
                icon={BsMusicNoteBeamed}
                label="ADD AUDIO BLOCK"
              />
            )}
          </div>
        </div>
        <hr className="border-t border-black my-5" />
        <div className="lg:p-6 flex-1 p-3">
          <div className="max-w-xl w-full flex flex-col mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-wider mb-4">{chapter.title}</h2>
            {chapter.chapter_content?.text?.length ? (
              chapter.chapter_content.text.map((text: string, index: number) => (
                <p key={index} className="mb-4 border-black border rounded-lg p-4">
                  {text}
                </p>
              ))
            ) : (
              <p>No text content available for this chapter.</p>
            )}
            <IconButton
              onClick={() => openModal("text")}
              icon={BsFileText}
              label="ADD TEXT BLOCK"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
