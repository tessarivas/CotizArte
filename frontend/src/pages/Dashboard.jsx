import { useNavigate } from "react-router-dom";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import { SparklesText } from "@/components/magicui/sparkles-text-variant";
import ActionCards from "@/components/ActionCards";
import DashboardStats from "@/components/DashboardStats";
import { HeartIcon } from "lucide-react"; 

function Dashboard() {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate("/account");
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent h-[30vh] flex items-center justify-center relative">
        <div className="mt-22">
          <SparklesText text="Panel de Trabajo" />
        </div>
      </div>

      {/* Action Cards */}
      <div className="flex flex-col items-center justify-center">
        <ActionCards />
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      <footer className="bg-gradient-to-r from-accent via-secondary to-primary">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            {/* Logo/Título */}
            <div className="mb-6">
              <img
                src="/CotizArte_Logo.webp"
                alt="Logo de CotizArte"
                className="w-46 rotate-5 mx-auto"
              />
            </div>

            {/* Copyright */}
            <div>
              <p className="text-neutral text-sm">
                © {new Date().getFullYear()} CotizArte. Creado con{" "}
                <HeartIcon className="w-4 h-4 inline text-pink-400" /> para
                artistas independientes.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante de cuenta */}
      <button
        onClick={handleAccountClick}
        className="fixed bottom-6 right-6 p-3 cursor-pointer bg-secondary text-white rounded-full shadow-lg hover:bg-secondary/90 hover:scale-110 transition-all duration-300 z-50"
        title="Mi cuenta"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>
    </>
  );
}

export default Dashboard;
