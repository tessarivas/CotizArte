import { SparklesText } from "@/components/magicui/sparkles-text";
import { Particles } from "@/components/magicui/particles";
import SplashCursor from "@/blocks/Animations/SplashCursor/SplashCursor";

export const WelcomeSection = () => {
  return (
    <>
      <div className="h-screen w-full snap-start bg-gradient-to-b from-teal-200 via-white to-orange-200 flex flex-col justify-center items-center text-center px-8 relative">
        {/* Partículas y Cursor */}
        <div className="absolute inset-0 z-10">
          <Particles
            className="absolute inset-0"
            quantity={200}
            ease={100}
            color="#ffffff"
            refresh
          />
          <SplashCursor />
        </div>

        {/* Imágenes de acuarela */}
        <img
          src="/Acuarela Azul.png"
          alt="Acuarela Azul"
          className="absolute top-[-20vh] left-[32vw] w-[30vw] rotate-180 opacity-100 mix-blend-darken z-0"
        />

        <img
          src="/Acuarela Naranja.png"
          alt="Acuarela Naranja"
          className="absolute top-1/2 right-[-5vw] w-[30vw] opacity-100 mix-blend-darken z-0"
        />

        <img
          src="/Acuarela Rosa.png"
          alt="Acuarela Rosa"
          className="absolute top-1/4 left-[-5vw] w-[30vw] opacity-100 mix-blend-darken z-0"
        />

        <img
          src="/QueEsCotizArte.svg"
          alt="Que es CotizArte"
          className="absolute top-[23vh] left-[63vw] w-[18vw] opacity-100 rotate-6 z-20"
        />

        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute w-full h-full flex justify-center items-center">
            <div className="relative w-[90vw] h-[90vh] overflow-hidden">
              {/* Estrellas animadas */}
              <img
                src="/Sparkle.svg"
                alt="Efecto de Brillo"
                className="absolute top-[15%] left-[25%] w-6 h-6 opacity-80 animate-sparkle"
              />

              <img
                src="/Sparkle.svg"
                alt="Efecto de Brillo"
                className="absolute top-[35%] right-[10%] w-8 h-8 opacity-80 animate-sparkle"
              />

              <img
                src="/Sparkle.svg"
                alt="Efecto de Brillo"
                className="absolute top-[50%] left-[10%] w-5 h-5 opacity-80 animate-sparkle"
              />

              <img
                src="/Sparkle.svg"
                alt="Efecto de Brillo"
                className="absolute top-[65%] right-[30%] w-7 h-7 opacity-80 animate-sparkle"
              />

              <img
                src="/Sparkle.svg"
                alt="Efecto de Brillo"
                className="absolute top-[90%] right-[70%] w-5 h-5 opacity-80 animate-sparkle"
              />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="relative z-20 flex flex-col items-center justify-center h-[50vh] min-h-[400px] overflow-hidden">
          <div className="text-center px-4 pt-15">
            <div className="mb-2">
              <SparklesText text="Valora tu arte, aprende a" />
            </div>

            {/* Imagen CotizArte */}
            <img
              src="/CotizArte_Logo.png"
              alt="CotizArte Logo"
              className="mx-auto w-62 md:w-78 lg:w-94 opacity-100 rotate-5"
            />
          </div>
        </div>
      </div>
    </>
  );
};
