import React from "react";
import { motion } from "framer-motion";
import { Particles } from "@/components/magicui/particles";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useNavigate } from "react-router-dom";
import { SparklesText } from "@/components/magicui/sparkles-text";

export const GoalsSection = () => {
  const navigate = useNavigate();

  const handleCreateQuote = () => {
    const token = localStorage.getItem("access_token");
    navigate(token ? "/quotes" : "/login");
  };

  return (
    <div className="relative h-screen w-full snap-start bg-gradient-to-b from-teal-200 via-pink-200 to-orange-200 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
      {/* Partículas en el fondo */}
      <div className="absolute inset-0 z-0">
        <Particles
          className="absolute inset-0"
          quantity={150}
          ease={100}
          color="#ffffff"
          refresh
        />
      </div>

      {/* Sparkles decorativos */}
      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[15%] left-[10%] w-5 lg:w-7 h-5 lg:h-7 opacity-80 animate-sparkle z-10"
      />
      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute top-[20%] right-[15%] w-4 lg:w-6 h-4 lg:h-6 opacity-80 animate-sparkle z-10"
      />
      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute bottom-[20%] left-[10%] w-5 lg:w-8 h-5 lg:h-8 opacity-80 animate-sparkle z-10"
      />
      <img
        src="/Sparkle.svg"
        alt="Efecto de Brillo"
        className="absolute bottom-[15%] right-[10%] w-4 lg:w-5 h-4 lg:h-5 opacity-80 animate-sparkle z-10"
      />

      {/* Imagen centrada y fija */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center z-20"
      >
        <img
          src="/Pasos_Crear_Cotización.webp"
          alt="Pasos para Crear Cotización"
          className="max-w-full max-h-[70%] object-contain drop-shadow-lg"
        />
      </motion.div>

      {/* Título centrado encima de la imagen */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-800 text-center font-logo-text z-30"
      >
        <SparklesText text="Pasos para crear una cotización:" />
      </motion.h2>

      {/* Botón centrado encima de la imagen */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 z-30"
      >
        <InteractiveHoverButton
          onClick={handleCreateQuote}
          className="bg-gradient-to-b from-teal-300 to-sky-300 text-white hover:text-sky-300 font-regular-text px-6 py-4 lg:px-8 lg:py-3 text-lg lg:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          Crear Cotización
        </InteractiveHoverButton>
      </motion.div>
    </div>
  );
};
