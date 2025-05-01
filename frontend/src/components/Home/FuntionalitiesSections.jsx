import { motion } from "framer-motion";
import { Particles } from "@/components/magicui/particles";

export const FuncionalitiesSection = () => {
  const cards = [
    {
      src: "/src/assets/images/CotizArte_Cards/Card1.png",
      alt: "Card 1",
      top: "10vw",
      left: "1vw",
      rotate: -2,
    },
    {
      src: "/src/assets/images/CotizArte_Cards/Card2.png",
      alt: "Card 2",
      top: "22vw",
      left: "17vw",
      rotate: 2,
    },
    {
      src: "/src/assets/images/CotizArte_Cards/Card3.png",
      alt: "Card 3",
      top: "8vw",
      left: "33vw",
      rotate: -2,
    },
    {
      src: "/src/assets/images/CotizArte_Cards/Card4.png",
      alt: "Card 4",
      top: "20vw",
      left: "49vw",
      rotate: 2,
    },
    {
      src: "/src/assets/images/CotizArte_Cards/Card5.png",
      alt: "Card 5",
      top: "10vw",
      left: "65vw",
      rotate: -2,
    },
    {
      src: "/src/assets/images/CotizArte_Cards/Card6.png",
      alt: "Card 6",
      top: "22vw",
      left: "81vw",
      rotate: 2,
    },
  ];

  const Card = ({ src, alt, top, left, rotate }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1, rotate: rotate }}
      transition={{ duration: 0.5 }}
      className="absolute w-70 bg-white/60 p-4 rounded-field shadow-xl"
      style={{ top, left }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-md"
      />
    </motion.div>
  );

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
        className="absolute top-[8vw] left-[30vw] w-[40vw] rotate-15 opacity-50 mix-blend-lighten z-0"
      />
      <img
        src="/src/assets/images/Acuarela Naranja.png"
        alt="Acuarela Naranja"
        className="absolute top-[8vw] right-[5vw] w-[35vw] rotate-35 opacity-80 mix-blend-lighten z-0"
      />
      <img
        src="/src/assets/images/Acuarela Rosa.png"
        alt="Acuarela Rosa"
        className="absolute top-[7¿8vw] left-[2vw] w-[35vw] rotate-70 opacity-100 mix-blend-lighten z-0"
      />

      <img
        src="/src/assets/svg/Funcionalidades.svg"
        alt="Que es CotizArte"
        className="absolute top-[28vh] left-[22vw] w-[10vw] opacity-100 rotate-355 z-20"
      />

      {/* Estrellas animadas */}
      <img
        src="/src/assets/svg/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[15%] left-[25%] w-6 h-6 opacity-80 animate-sparkle"
      />

      <img
        src="/src/assets/svg/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[35%] right-[10%] w-8 h-8 opacity-80 animate-sparkle"
      />

      <img
        src="/src/assets/svg/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[65%] left-[10%] w-5 h-5 opacity-80 animate-sparkle"
      />

      <img
        src="/src/assets/svg/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[65%] right-[30%] w-7 h-7 opacity-80 animate-sparkle"
      />

      <img
        src="/src/assets/svg/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[90%] right-[70%] w-5 h-5 opacity-80 animate-sparkle"
      />

      {/* Cartas */}
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};
