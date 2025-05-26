import { motion } from "framer-motion";
import { Particles } from "@/components/magicui/particles";

export const FuncionalitiesSection = () => {
  const cards = [
    {
      src: "/CotizArte_Cards/Card1.webp",
      alt: "Card 1",
      rotate: -2,
    },
    {
      src: "/CotizArte_Cards/Card2.webp",
      alt: "Card 2",
      rotate: 2,
    },
    {
      src: "/CotizArte_Cards/Card3.webp",
      alt: "Card 3",
      rotate: 0,
    },
    {
      src: "/CotizArte_Cards/Card4.webp",
      alt: "Card 4",
      rotate: 2,
    },
    {
      src: "/CotizArte_Cards/Card5.webp",
      alt: "Card 5",
      rotate: -2,
    },
  ];

  const Card = ({ src, alt, rotate, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1, rotate: rotate }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-[240px] xl:w-[280px] 2xl:w-[320px] bg-white/60 p-4 xl:p-5 rounded-field shadow-xl"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-md"
      />
    </motion.div>
  );

  return (
    <div className="relative h-screen w-full snap-start bg-gradient-to-b from-orange-200 via-pink-200 to-teal-200 flex items-center justify-center p-4 lg:p-8">
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

      {/* Imágenes de acuarela - Responsivas */}
      <img
        src="/Acuarela Azul.webp"
        alt="Acuarela Azul"
        className="absolute top-[10%] lg:top-[25%] left-[20%] lg:left-[30%] w-[45%] lg:w-[35%] rotate-120 opacity-50 mix-blend-lighten z-0"
      />
      <img
        src="/Acuarela Naranja.webp"
        alt="Acuarela Naranja"
        className="absolute top-[15%] lg:top-[25%] right-[5%] lg:right-[5%] w-[45%] lg:w-[30%] rotate-35 opacity-80 mix-blend-lighten z-0"
      />
      <img
        src="/Acuarela Rosa.webp"
        alt="Acuarela Rosa"
        className="absolute top-[20%] lg:top-[25%] left-[2%] lg:left-[5%] w-[45%] lg:w-[30%] rotate-70 opacity-100 mix-blend-lighten z-0"
      />

      {/* Estrellas animadas - Adaptadas */}
      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[15%] left-[20%] lg:left-[5%] lg:top-[20%] w-4 lg:w-6 h-4 lg:h-6 opacity-80 animate-sparkle z-30"
      />

      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[25%] lg:top-[15%] right-[10%] lg:right-[5%] w-5 lg:w-8 h-5 lg:h-8 opacity-80 animate-sparkle z-30"
      />

      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[55%] lg:top-[60%] left-[10%] lg:left-[45%] w-4 lg:w-5 h-4 lg:h-5 opacity-80 animate-sparkle z-30"
      />

      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[60%] lg:top-[85%] right-[25%] lg:right-[30%] w-5 lg:w-7 h-5 lg:h-7 opacity-80 animate-sparkle z-30"
      />

      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute bottom-[10%] lg:top-[90%] right-[60%] lg:right-[10%] w-4 lg:w-5 h-4 lg:h-5 opacity-80 animate-sparkle z-30"
      />

      {/* Mobile: Grid 2 columnas x 3 filas */}
      <div className="block md:hidden w-full px-4 z-30">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {cards.slice(0, 5).map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, rotate: card.rotate }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full bg-white/60 p-1 rounded-xl shadow-xl"
            >
              <img
                src={card.src}
                alt={card.alt}
                className="w-full h-full object-cover rounded-md"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tablet: Grid simplificado */}
      <div className="hidden md:block lg:hidden">
        <div className="flex flex-wrap justify-center items-center gap-8 w-full h-full">
          {cards.slice(0, 4).map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1, rotate: card.rotate }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-[220px] bg-white/60 p-4 rounded-field shadow-xl z-20"
            >
              <img
                src={card.src}
                alt={card.alt}
                className="w-full h-full object-cover rounded-md"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid centrado con gap uniforme */}
      <div className="hidden lg:flex xl:flex 2xl:flex items-center justify-center w-full h-full z-20">
        <div className="grid grid-cols-5 gap-8 xl:gap-12 2xl:gap-16">
          {/* Primera fila: 3 cartas */}
          <Card {...cards[0]} index={0} />
          <Card {...cards[1]} index={1} />
          <Card {...cards[2]} index={2} />
          <Card {...cards[3]} index={3} />
          <Card {...cards[4]} index={4} />
        </div>
      </div>
    </div>
  );
};
