import { CardSwipe } from "@/components/ui/card-swipe";
import { Particles } from "@/components/magicui/particles";

export const FuncionalitiesSection = () => {
  const images = [
    { src: "/src/assets/images/CotizArte_Cards/Card1.png", alt: "Card 1" },
    { src: "/src/assets/images/CotizArte_Cards/Card2.png", alt: "Card 2" },
    { src: "/src/assets/images/CotizArte_Cards/Card3.png", alt: "Card 3" },
    { src: "/src/assets/images/CotizArte_Cards/Card4.png", alt: "Card 4" },
    { src: "/src/assets/images/CotizArte_Cards/Card5.png", alt: "Card 5" },
    { src: "/src/assets/images/CotizArte_Cards/Card6.png", alt: "Card 6" },
  ];

  return (
    <div className="relative h-screen w-full snap-start bg-gradient-to-b from-orange-200 via-pink-200 to-teal-200 flex items-center justify-center p-8">
      {/* Partículas en el fondo */}
      <div className="absolute inset-0 z-0">
        <Particles
          className="absolute inset-0"
          quantity={200}
          ease={100}
          color="#ffffff"
          refresh
        />
      </div>

      {/* Imágenes de acuarela */}
      <img
        src="/src/assets/images/Acuarela Azul.png"
        alt="Acuarela Azul"
        className="absolute top-[8vw] left-[26vw] w-[50vw] rotate-15 opacity-60 mix-blend-darken z-0"
      />
      <img
        src="/src/assets/images/Acuarela Naranja.png"
        alt="Acuarela Naranja"
        className="absolute top-[7vw] right-[2vw] w-[35vw] opacity-100 mix-blend-darken z-0"
      />
      <img
        src="/src/assets/images/Acuarela Rosa.png"
        alt="Acuarela Rosa"
        className="absolute top-[7vw] left-[2vw] w-[35vw] rotate-20 opacity-100 mix-blend-darken z-0"
      />

      
      <div className="absolute mt-12 w-[30vw] h-[70vh] bg-white/50 border-5 border-white mix-blend-overlay rounded-3xl shadow-2xl z-10"></div>
      <div className="absolute mt-12 w-[30vw] h-[70vh] rounded-3xl shadow-2xl z-10"></div>
      <div className="relative max-w-2xl mt-20 z-10">
        <div className="w-full">
          <CardSwipe
            images={images}
            autoplayDelay={2000}
            slideShadows={false}
          />
        </div>
      </div>
    </div>
  );
};
