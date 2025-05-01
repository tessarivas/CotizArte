import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

export const CardCarousel = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    /* height: 300px; */
    /* margin: 20px; */
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
  }

  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  .swiper-pagination-bullet-active {
  background-color: #f28da9 !important; /* Rosa pastel */
  }
  `;
  return (
    <section className="w-ace-y-4">
      <style>{css}</style>
      <div className="relative flex w-full items-center justify-center h-full">
        {/* Fondo con overlay y sombra */}
        <div className="absolute w-[61vw] h-[70vh] bg-white/50 border-10 border-white backdrop-blur-sm rounded-3xl shadow-2xl z-0"></div>
        {/* Swiper con las cartas */}
        <div className="relative z-10 w-[60vw]">
          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{
              delay: autoplayDelay,
              disableOnInteraction: false,
            }}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: false,
              renderBullet: (index, className) => {
                return index < 6 ? `<span class="${className}"></span>` : "";
              },
            }}
            navigation={
              showNavigation
                ? {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }
                : undefined
            }
            modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="size-full rounded-3xl">
                  <img
                    src={image.src}
                    className="size-full rounded-xl"
                    alt={image.alt}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
