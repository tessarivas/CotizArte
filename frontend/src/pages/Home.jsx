import { WelcomeSection } from "../components/Home/WelcomeSection";
import { FuncionalitiesSection } from "@/components/Home/FuntionalitiesSections";
import { GoalsSection } from "@/components/Home/GoalsSections";
import { FootSection } from "@/components/Home/FootSection";
import { Outlet } from "react-router";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="h-screen w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory">
      <WelcomeSection />
      <FuncionalitiesSection />
      <GoalsSection />
      <FootSection />
      <Outlet />
    </div>
  );
}

export default Home;
