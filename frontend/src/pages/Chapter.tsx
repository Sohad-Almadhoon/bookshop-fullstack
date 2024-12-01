import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  BsFileText,
  BsMusicNoteBeamed,
} from "react-icons/bs";

import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import { useNovelModal } from "../hooks/useNovelModal";
import VoicePlayer from "../components/shared/VoicePlayer";
import newRequest from "../utils/newRequest";
interface IconButtonProps {
  icon: React.ElementType<{ className?: string }>;
  label: string;
  onClick: () => void;
}
const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  label,
}) => (
  <Button
    onClick={onClick}
    className="flex items-center justify-center gap-x-3 my-5 max-w-sm w-full mx-auto">
    <Icon className="text-lg" />
    {label}{" "}
  </Button>
);
const ChapterPage: React.FC = () => {
  const { openModal } = useNovelModal();
  const location = useLocation();
  const navigate = useNavigate();
  const { chapterTitle, title, id: bookId } = location.state || {};
  const { id } = useParams();
 
  interface Chapter {
    id: string;
    title: string;
    cover_image: string;
    chapter_content: ChapterContent | null;
  }

  interface ChapterContent {
    text: string[]  | [];
    audio: string | null;
  }

  const [chapter, setChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await newRequest.get(
          `/api/books/${bookId}/chapters/${id}`
        );
        console.log(response.data);
        setChapter(response.data);
      } catch (err) {
        console.error("Error fetching chapter:", err);
      }
    };

    if (bookId && id) {
      fetchChapter();
    }
  }, [bookId, id]);

  const handleNextChapter = async () => {
    if (!chapter) return;

    try {
      const nextChapterId = (parseInt(chapter.id) + 1).toString();
      const { data } = await newRequest.get(
        `/api/books/${bookId}/chapters/${nextChapterId}`
      );

      navigate(`/chapters/${nextChapterId}`, {
        state: {
          chapterTitle: data.chapter.title,
          title,
          bookId,
        },
      });
    } catch (error) {
      console.error("Error fetching next chapter:", error);
    }
  };

  const handlePrevChapter = async () => {
    if (!chapter) return;

    try {
      const prevChapterId = (parseInt(chapter.id) - 1).toString();
      const { data } = await newRequest.get(
        `/api/books/${bookId}/chapters/${prevChapterId}`
      );

      navigate(`/chapters/${prevChapterId}`, {
        state: {
          chapterTitle: data.chapter.title,
          title,
          bookId,
        },
      });
    } catch (error) {
      console.error("Error fetching previous chapter:", error);
    }
  };

  return (
    <div className="min-h-screen border border-black">
      <Header
        title={<h3 className="text-3xl uppercase font-romieMedium">{title}</h3>}
      />
      <div className="flex">
        <div className="flex-1 border-r border-black">
          <div className="flex flex-col items-center justify-center mt-9">
            <img
              src={chapter?.cover_image}
              alt="chapter cover"
              className="h-[420px] w-full object-contain"
            />

            <div className="flex p-2 mt-5 gap-3 w-full max-w-lg border-black border border-opacity-30 rounded-2xl items-center">
              {chapter?.chapter_content?.audio ? (
                <VoicePlayer url={chapter.chapter_content.audio} />
              ) : (
                <p>No audio available for this chapter.</p>
              )}
            </div>
            {!chapter?.chapter_content?.audio && (
              <IconButton
                onClick={() => openModal("audio")}
                icon={BsMusicNoteBeamed}
                label="ADD AUDIO BLOCK"
              />
            )}
          </div>
        </div>
        <div className="p-6 flex-1">
          <div className="max-w-xl w-full flex flex-col mx-auto">
            <h2 className="text-5xl font-medium tracking-wider mb-4">
              {chapterTitle}
            </h2>
            {chapter?.chapter_content?.text?.length ? (
              chapter.chapter_content.text.map((text, index) => (
                <p key={index} className="mb-4">
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
