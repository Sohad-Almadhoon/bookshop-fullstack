import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { ButtonHTMLAttributes, useRef } from "react";
import {
  BsChevronLeft,
  BsChevronRight,
  BsImageFill,
  BsMusicNoteBeamed,
  BsLightningCharge,
  BsHeart,
  BsFileText,
} from "react-icons/bs";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import { useNovelModal } from "../hooks/useNovelModal";
import VoicePlayer from "../components/VoicePlayer";

import "swiper/css";
import "swiper/css/effect-coverflow";
import NovelModal from "../components/modals/NovelModal";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType<{ className?: string }>;
  label: string;
}

interface CardSectionProps {
  title: string;
  content: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  label,
}) => (
  <Button
    onClick={onClick}
    className="flex items-center justify-center gap-x-3 my-5 max-w-sm w-full mx-auto">
    <Icon className="text-sm" />
    {label}
  </Button>
);

const CardSection: React.FC<CardSectionProps> = ({ title, content }) => (
  <div className="border border-black border-opacity-30 flex-1 rounded-2xl p-4 mt-5">
    <div className="flex justify-between">
      <div className="flex gap-2">
        <BsLightningCharge className="w-10 h-10 border-2 bg-black text-white rounded-full p-2 cursor-pointer" />
        <BsHeart className="w-10 h-10 border-2 border-black rounded-full p-2 cursor-pointer" />
      </div>
      <img src="/assets/collection-thumbnail.png" alt="thumbnail" width={60} />
    </div>
    <p>
      <span className="text-6xl">W</span>
      {content}
    </p>
  </div>
);

const Discover: React.FC = () => {
  const { openModal } = useNovelModal();
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="min-h-screen border border-black">
      <Header />
      <div className="flex">
        <div className="flex-1 border-r border-black">
          <div className=" flex flex-col items-center relative">
            <IconButton
              onClick={() => openModal("visual")}
              icon={BsImageFill}
              label="BUY VISUAL BLOCK $10"
            />

            <Swiper
              effect="coverflow"
              grabCursor
              centeredSlides
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 50,
                stretch: 15,
                depth: 100,
                modifier: 3,
                slideShadows: true,
              }}
              modules={[EffectCoverflow]}
              className="my-5 h-fit flex justify-center mx-auto"
              initialSlide={1}
              onSwiper={(swiper) => (swiperRef.current = swiper)}>
              {["book-1.png", "book-2.png", "book-3.png"].map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`/assets/${img}`}
                    alt={`Book ${index + 1}`}
                    className="h-[420px] w-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className={`absolute top-1/2 left-14 rounded-full w-10 h-10 flex justify-center items-center z-10 border border-black`}>
              <BsChevronLeft className="text-sm" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className={`absolute top-1/2 right-14 rounded-full w-10 h-10 flex justify-center items-center z-10 border border-black`}>
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
              label="BUY AUDIO BLOCK $8"
            />
          </div>
        </div>

        <div className="p-6 flex-1">
          <div className="max-w-xl w-full flex flex-col mx-auto">
            <h2 className="text-5xl font-medium tracking-wider mb-4">
              MORAL PHILOSOPHY & <span className="text-xl">THE</span> AI PANIC
            </h2>
            <CardSection
              title="AI Panic Letter"
              content="hat is it about artificial intelligence that has the world in such an uproar? An open letter is being circulated (Future of Life, 2023) after being signed by heads of industry and famous thinkers including Max Tegmark and other respectable minds..."
            />
            <IconButton
              onClick={() => openModal("text")}
              icon={BsFileText}
              label="BUY AUDIO BLOCK $8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
