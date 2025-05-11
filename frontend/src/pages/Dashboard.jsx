import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import ActionCards from "@/components/ActionCards";

function Dashboard() {
  return (
    <>
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Panel de Trabajo" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ActionCards />
      </div>
      
    </>
  );
}

/*
<GradientText
  colors={["#44EBD2", "#FF7497", "#FFAE74", "#FF7497", "#44EBD2"]}
  animationSpeed={8}
  className="text-6xl font-bold text-center font-handwriting-text"
>
  Acciones que puedes realizar
</GradientText>
*/

export default Dashboard;
