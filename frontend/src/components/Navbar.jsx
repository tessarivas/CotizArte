import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PaintBrushIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Navbar() {
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
            <Link to="/cotizaciones" className="hover:bg-white/50 px-4 py-2 rounded-3xl transition">
              Cotizaciones
            </Link>
          </li>
          <li className="relative group">
            <button className="hover:bg-white/50 px-4 py-2 rounded-3xl transition flex items-center gap-2">
              Servicios
              <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            {/* Dropdown */}
            <ul className="absolute top-full left-1/2 border-5 border-white/10 transform -translate-x-1/2 mt-4 w-40 bg-white/60 backdrop-blur-lg shadow-md rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
              <li>
                <Link to="/servicios/proyectos" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/50 rounded-xl transition">
                  <PaintBrushIcon className="w-5 h-5 text-neutral" />
                  Proyectos
                </Link>
              </li>
              <li>
                <Link to="/servicios/mercado" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/50 rounded-xl transition">
                  <ShoppingBagIcon className="w-5 h-5 text-neutral" />
                  Mercado
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/clientes" className="hover:bg-white/50 px-4 py-2 rounded-3xl transition">
              Clientes
            </Link>
          </li>
        </ul>
      </div>

      <Link to="/login">
        <InteractiveHoverButton className="fixed top-10 right-10 z-50 bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold text-white font-regular-text px-6 py-4 rounded-full shadow-md hover:bg-white hover:text-[#f28da9] transition">
          Iniciar Sesión
        </InteractiveHoverButton>
      </Link>
    </>
  );
}
