import { motion } from "framer-motion";
import { Particles } from "@/components/magicui/particles";

export const FootSection = () => {
  const socialLinks = [
    {
      name: "Gmail",
      icon: "/gmail.png",
      url: "mailto:contacto@cotizarte.com",
    },
    {
      name: "Pinterest",
      icon: "/pinterest.png",
      url: "https://pinterest.com/tessarivasart",
    },
    {
      name: "Instagram",
      icon: "/instagram.png",
      url: "https://instagram.com/tessarivasart",
    },
    {
      name: "LinkedIn",
      icon: "/linkedin.png",
      url: "https://www.linkedin.com/in/teresa-rivas-g%C3%B3mez-072458294/",
    },
  ];

  return (
    <div className="relative h-screen w-full snap-start bg-gradient-to-b from-orange-200 via-white to-white flex flex-col justify-center items-center text-center overflow-hidden">
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

      {/* Imágenes de acuarela - Nubes posicionadas arriba */}
      <img
        src="/foot_watercolor_clouds.webp"
        alt="Nubes de acuarela"
        className="absolute top-0 left-0 w-full h-auto object-cover object-top opacity-100 z-10"
      />

      {/* Contenido principal centrado */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Texto principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-4 font-logo-text">
              ¡Gracias por visitarnos!
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 font-title-text">
              CotizArte - Tu herramienta de cotización artística
            </p>
          </motion.div>

          {/* Iconos de redes sociales */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-center gap-6 lg:gap-8 mb-8"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target={social.name === "Gmail" ? "_self" : "_blank"}
                rel={social.name !== "Gmail" ? "noopener noreferrer" : ""}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5 + index * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <div className="relative">
                  <img
                    src={social.icon}
                    alt={`${social.name} icon`}
                    className="w-12 h-12 lg:w-16 lg:h-16 transition-all duration-300 group-hover:drop-shadow-lg"
                  />

                  {/* Efecto de brillo al hover */}
                  <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {social.name}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright o mensaje adicional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-sm text-gray-500"
          >
            <p>© 2024 CotizArte. Todos los derechos reservados.</p>
          </motion.div>
        </div>
      </div>

      {/* Estrellas animadas - Reposicionadas para no interferir */}
      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[60%] left-[15%] lg:left-[10%] w-4 lg:w-6 h-4 lg:h-6 opacity-80 animate-sparkle z-30"
      />

      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[65%] right-[15%] lg:right-[10%] w-5 lg:w-8 h-5 lg:h-8 opacity-80 animate-sparkle z-30"
      />

      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[75%] left-[30%] lg:left-[25%] w-4 lg:w-5 h-4 lg:h-5 opacity-80 animate-sparkle z-30"
      />

      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[80%] right-[35%] lg:right-[30%] w-5 lg:w-7 h-5 lg:h-7 opacity-80 animate-sparkle z-30"
      />

      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute bottom-[15%] right-[50%] lg:right-[45%] w-4 lg:w-5 h-4 lg:h-5 opacity-80 animate-sparkle z-30"
      />
    </div>
  );
};
