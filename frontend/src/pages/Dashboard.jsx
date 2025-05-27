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

export default Dashboard;
