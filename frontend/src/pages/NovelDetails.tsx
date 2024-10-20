
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";

import "swiper/css";

import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useRef } from "react";
import { BsChevronLeft, BsChevronRight, BsImageFill } from "react-icons/bs";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import { useNovelModal } from "../hooks/useNovelModal";

const NovelDetails = () => {
  const {openModal} = useNovelModal()
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <div className="relative max-w-2xl mx-auto bg-white">
          <Button onClick={openModal}>
            <BsImageFill />
            BUY VISUAL BLOCK $10
          </Button>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 15,
              depth: 100,
              modifier: 3,
              slideShadows: true,
            }}
            modules={[EffectCoverflow]}
            className="w-1/2 py-8 mb-6"
            initialSlide={1}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}>
            <SwiperSlide>
              <img src="/assets/book-1.png" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/assets/book-2.png" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/assets/book-3.png" alt="" />
            </SwiperSlide>
          </Swiper>

          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute top-1/2 -translate-x-1/2 left-[120px] bg-light rounded-full w-10 h-10 flex justify-center items-center z-10">
            <BsChevronLeft className="text-xl" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute top-1/2 -translate-x-1/2 right-[85px] bg-light rounded-full w-10 h-10 flex justify-center items-center z-10">
            <BsChevronRight className="text-xl" />
          </button>
        </div>
        <div>
          <h2 className="text-4xl">MORAL PHILOSOPHY & THE AI PANIC</h2>
        </div>{" "}
      </div>
    </div>
  );
};

export default NovelDetails;
