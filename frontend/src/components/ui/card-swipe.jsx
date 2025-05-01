import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";

export const CardSwipe = ({ images, autoplayDelay = 1500, slideShadows = false }) => {
  const css = `
  .swiper {
    width: 20vw; /* Tamaño más compacto */
    padding-bottom: 30px;
  }
  
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
    border-radius: 12px; /* Hace que las imágenes tengan bordes redondeados */
  }
  
  .swiper-pagination-bullet {
    background-color: #fff;
    opacity: 0.7;
  }
  
  .swiper-pagination-bullet-active {
    background-color: #44ebd2 !important; /* Rosa pastel */
    opacity: 1;
    transform: scale(1.2); /* Hace que el punto activo resalte */
  }
  `;

  return (
    <section className="relative flex w-full items-center justify-center h-screen">
      <style>{css}</style>
      {/* Swiper con el efecto Cards */}
      <div className="relative flex items-center justify-center w-[50vw] h-[70vh] z-10 overflow-hidden">
        <Swiper
          autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
          effect={"cards"}
          grabCursor={true}
          loop={true}
          slidesPerView={1}
          cardsEffect={{ slideShadows: slideShadows }}
          pagination={{
            clickable: true,
            dynamicBullets: false,
            renderBullet: (index, className) => {
              return index < 6 ? `<span class="${className}"></span>` : "";
            },
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[EffectCards, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="size-full rounded-3xl">
                <img src={image.src} className="size-full rounded-xl" alt={image.alt} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
