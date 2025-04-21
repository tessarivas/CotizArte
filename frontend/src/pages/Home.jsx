import { Hero } from "../components/Hero.jsx";
import { Functionalities } from "@/components/Functionalities.jsx";
import { Outlet } from "react-router";

function Home() {
  return (
    <>
      <Hero />
      <Functionalities />
      <Outlet />
    </>
  );
}

export default Home;
