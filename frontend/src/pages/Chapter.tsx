import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { useEffect, useRef, useState } from "react";
import {
  BsChevronLeft,
  BsChevronRight,
  BsLightningCharge,
  BsHeart,
  BsFileText,
  BsMusicNoteBeamed,
} from "react-icons/bs";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import { useNovelModal } from "../hooks/useNovelModal";
import VoicePlayer from "../components/VoicePlayer";

import "swiper/css";
import "swiper/css/effect-coverflow";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { Chapter } from "../components/book/ChaptersArea";

interface IconButtonProps {
  icon: React.ElementType<{ className?: string }>;
  label: string;
  price: number;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  label,
  price,
}) => (
  <Button
    onClick={onClick}
    className="flex items-center justify-center gap-x-3 my-5 max-w-sm w-full mx-auto">
    <Icon className="text-lg" />
    {label}{" "}
    <b className="text-lg">
      <sup>$</sup>
      {price}
    </b>
  </Button>
);

const ChapterPage: React.FC = () => {
  const { openModal } = useNovelModal();
  const swiperRef = useRef<SwiperType | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    chapterTitle,
    title,
    id: bookId,
    chapterIndex,
  } = location.state || {};
  console.log(location.state)
  const { id } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await newRequest.get(`/api/books/${bookId}/chapters`);
        setChapters(response.data);
      } catch (err) {
        console.error("Error fetching chapters:", err);
      }
    };
    fetchChapters();
  }, [id, bookId]);

  const chapterImages = chapters.map((chapter) => chapter.cover_image);
  const handleImageClick = (index: number) => {
   
   const selectedChapter = chapters[index];
   navigate(`/chapters/${selectedChapter.id}`, {
     state: {
       chapterTitle: selectedChapter.title,
       title,
       bookId,
       chapterIndex: index,
     },
   });
 };

  return (
    <div className="min-h-screen border border-black">
      <Header
        title={<h3 className="text-3xl uppercase font-romieMedium">{title}</h3>}
      />
      <div className="flex">
        <div className="flex-1 border-r border-black">
          <div className="flex flex-col items-center relative">
            <Swiper
              effect="coverflow"
              grabCursor
              centeredSlides
              slidesPerView="auto"
              initialSlide={chapterIndex || 0}
              coverflowEffect={{
                rotate: 50,
                stretch: 15,
                depth: 100,
                modifier: 3,
                slideShadows: true,
              }}
              modules={[EffectCoverflow]}
              className="my-5 h-fit flex justify-center mx-auto"
              onSwiper={(swiper) => (swiperRef.current = swiper)}>
              {chapterImages.map((img, index) => (
                <SwiperSlide
                  key={index}
                  onClick={() => handleImageClick(index)}>
                  <img
                    src={img}
                    alt={`Chapter ${index + 1}`}
                    className="h-[420px] w-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute top-1/2 left-14 rounded-full w-10 h-10 flex justify-center items-center z-10 border border-black">
              <BsChevronLeft className="text-sm" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute top-1/2 right-14 rounded-full w-10 h-10 flex justify-center items-center z-10 border border-black">
              <BsChevronRight className="text-sm" />
            </button>

            <div className="flex p-2 gap-3 border-black border border-opacity-30 rounded-lg items-center">
              <BsChevronLeft className="w-10 h-10 border border-opacity-30 rounded-full p-1 border-black cursor-pointer" />
              <BsLightningCharge className="w-10 h-10 border-2 bg-black text-white rounded-full p-2 cursor-pointer" />
              <BsHeart className="w-10 h-10 border-2 border-black rounded-full p-2 cursor-pointer" />
              <VoicePlayer />
              <img
                src="/assets/collection-thumbnail.png"
                alt="thumbnail"
                width={40}
              />
              <BsChevronRight className="w-10 h-10 border border-opacity-30 rounded-full p-1 border-black cursor-pointer" />
            </div>
            <IconButton
              onClick={() => openModal("audio")}
              icon={BsMusicNoteBeamed}
              label="ADD AUDIO BLOCK"
              price={8}
            />
          </div>
        </div>
        <div className="p-6 flex-1">
          <div className="max-w-xl w-full flex flex-col mx-auto">
            <h2 className="text-5xl font-medium tracking-wider mb-4">
              {chapterTitle}
            </h2>
            <IconButton
              onClick={() => openModal("text")}
              icon={BsFileText}
              label="ADD TEXT BLOCK"
              price={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
