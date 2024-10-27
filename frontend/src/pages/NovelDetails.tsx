import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { useRef } from "react";
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

const IconButton = ({ icon: Icon, onClick, label }) => (
  <Button
    onClick={onClick}
    className="flex items-center justify-center gap-x-3 my-5">
    <Icon />
    {label}
  </Button>
);

const NavigationButton = ({ onClick, position, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 ${position}-10 rounded-full w-10 h-10 flex justify-center items-center z-10 border border-black`}>
    <Icon className="text-sm" />
  </button>
);

const CardSection = ({ title, content }) => (
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

const NovelDetails = () => {
  const { openModal } = useNovelModal();
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="min-h-screen border border-black">
      <Header />
      <div className="flex">
        <div className="flex-1 flex flex-col items-center border-r border-black">
          <div className="max-w-md w-full relative">
            <IconButton
              onClick={openModal}
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
              className="my-5 bg-black rounded-2xl"
              initialSlide={1}
              onSwiper={(swiper) => (swiperRef.current = swiper)}>
              {["book-1.png", "book-2.png", "book-3.png"].map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={`/assets/${img}`} alt={`Book ${index + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>

            <NavigationButton
              onClick={() => swiperRef.current?.slidePrev()}
              position="-left"
              icon={BsChevronLeft}
            />
            <NavigationButton
              onClick={() => swiperRef.current?.slideNext()}
              position="-right"
              icon={BsChevronRight}
            />

            <VoicePlayer />
            <IconButton
              onClick={openModal}
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
              onClick={openModal}
              icon={BsFileText}
              label="BUY AUDIO BLOCK $8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelDetails;
