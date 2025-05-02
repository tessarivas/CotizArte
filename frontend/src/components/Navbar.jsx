import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PaintBrushIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUserState = () => {
      const token = localStorage.getItem("access_token");
      const userName = localStorage.getItem("user");
  
      setUser(token && userName ? userName : null);
    };
  
    updateUserState(); // Cargar estado inicial
    window.addEventListener("storage", updateUserState); // Detectar cambios en localStorage
  
    return () => {
      window.removeEventListener("storage", updateUserState); // Limpiar el listener
    };
  }, []);  

  const handleProtectedRoute = (route) => {
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      navigate("/login");
    } else {
      navigate(route);
    }
  };

  return (
    <>
      {/* Logo */}
      <Link to="/">
        <img
          src="/src/assets/images/CotizArte_Logo_Chico.png"
          alt="CotizArte Logo"
          className="fixed top-10 left-10 z-50 w-10 h-auto cursor-pointer transition-transform hover:scale-105"
        />
      </Link>

      {/* Navbar */}
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 w-[30%] bg-white/60 backdrop-blur-lg shadow-xl rounded-4xl px-6 py-2 hidden lg:flex">
        <ul className="flex w-full justify-around items-center text-lg font-bold text-neutral font-regular-text">
          <li>
            <button onClick={() => handleProtectedRoute("/cotizaciones")} className="hover:bg-white/50 px-4 py-2 rounded-3xl transition">
              Cotizaciones
            </button>
          </li>
          <li className="relative group">
            <button className="hover:bg-white/50 px-4 py-2 rounded-3xl transition flex items-center gap-2">
              Servicios
              <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            {/* Dropdown */}
            <ul className="absolute top-full left-1/2 border-5 border-white/10 transform -translate-x-1/2 mt-4 w-40 bg-white/60 backdrop-blur-lg shadow-md rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
              <li>
                <button onClick={() => handleProtectedRoute("/servicios/proyectos")} className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/50 rounded-xl transition">
                  <PaintBrushIcon className="w-5 h-5 text-neutral" />
                  Proyectos
                </button>
              </li>
              <li>
                <button onClick={() => handleProtectedRoute("/servicios/mercado")} className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/50 rounded-xl transition">
                  <ShoppingBagIcon className="w-5 h-5 text-neutral" />
                  Mercado
                </button>
              </li>
            </ul>
          </li>
          <li>
            <button onClick={() => handleProtectedRoute("/clientes")} className="hover:bg-white/50 px-4 py-2 rounded-3xl transition">
              Clientes
            </button>
          </li>
        </ul>
      </div>

      {/* Si el usuario está autenticado, muestra su nombre como botón */}
      {user ? (
        <button onClick={() => navigate("/account")} className="fixed top-10 right-10 z-50 bg-primary-content font-bold text-white font-regular-text px-6 py-4 rounded-full shadow-md hover:bg-primary transition">
          {user}
        </button>
      ) : (
        <Link to="/login">
          <InteractiveHoverButton className="fixed top-10 right-10 z-50 bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold text-white font-regular-text px-6 py-4 rounded-full shadow-md hover:bg-white hover:text-[#f28da9] transition">
            Iniciar Sesión
          </InteractiveHoverButton>
        </Link>
      )}
    </>
  );
}
