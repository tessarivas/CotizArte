import { TypingAnimation } from "@/components/magicui/typing-animation";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Particles } from "@/components/magicui/particles";
import SplashCursor from "@/blocks/Animations/SplashCursor/SplashCursor";

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-primary via-accent to-secondary">
      {/* Fondo y partículas */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={150}
        ease={100}
        color="#ffffff"
        refresh
      />

      {/* Contenedor principal del Hero con cursor */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[50vh] min-h-[400px] overflow-hidden">
        {/* El cursor solo se renderiza dentro de este div <SplashCursor />*/}
        <SplashCursor />

        {/* Contenido del Hero */}
        <div className="text-center px-4 pt-15">
          <div className="mb-5">
            <SparklesText text="Valora tu arte, aprende a CotizArte" />
          </div>
          <div className="max-w-3xl mx-auto">
            <TypingAnimation className="text-3xl text-neutral font-regular-text">
              Una herramienta inteligente diseñada para artistas que quieren
              calcular el verdadero valor de su trabajo.
            </TypingAnimation>
          </div>
        </div>
      </div>
    </div>
  );
};