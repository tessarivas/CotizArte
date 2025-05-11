import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la URL actual

  useEffect(() => {
    const updateUserState = () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return;
      }
      // Obtiene la imagen de perfil almacenada; si no existe, usa un fallback.
      const rawProfileImageUrl = localStorage.getItem("profileImageUrl");
      const fullProfileImageUrl = rawProfileImageUrl
        ? `http://localhost:3000${rawProfileImageUrl}`
        : "src/assets/images/default-profile.jpg";

      // Arma el objeto usuario con los datos disponibles.
      const name = localStorage.getItem("user") || "Usuario";
      const email = localStorage.getItem("email") || "No disponible";
      const bio = localStorage.getItem("bio") || "Sin biografía";

      setUser({ name, email, bio, profileImageUrl: fullProfileImageUrl });
    };

    updateUserState();
    window.addEventListener("storage", updateUserState);
    return () => {
      window.removeEventListener("storage", updateUserState);
    };
  }, []);

  const handleProtectedRoute = (route) => {
    const token = localStorage.getItem("access_token");
    navigate(token ? route : "/login");
  };

  // Definir las opciones del menú con sus rutas
  const navLinks = [
    { name: "Cotizaciones", path: "/quotes" },
    { name: "Proyectos", path: "/projects" },
    { name: "Mercado", path: "/market" },
    { name: "Clientes", path: "/clients" },
    { name: "Panel", path: "/dashboard" },
  ];

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
      <div className="fixed top-10 left-[50%] transform -translate-x-1/2 z-50 w-[34.5%] bg-white/60 backdrop-blur-lg shadow-xl rounded-4xl px-6 py-2 hidden lg:flex">
        <ul className="flex w-full justify-around items-center text-lg font-bold text-neutral font-regular-text gap-5 -ml-4">
          {navLinks.map((link) => (
            <li key={link.path}>
              <button
                onClick={() => handleProtectedRoute(link.path)}
                className={`px-4 py-2 rounded-field transition cursor-pointer ${
                  location.pathname === link.path
                    ? "bg-pink-300 text-white hover:bg-pink-400"
                    : "hover:bg-white/50"
                }`}
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón de usuario */}
      {user ? (
        <button
          onClick={() => navigate("/account")}
          className="fixed top-10 right-10 z-50 flex items-center gap-3 bg-primary font-bold text-primary-content hover:text-white font-regular-text px-6 py-3 rounded-full shadow-md hover:bg-primary-content transition-transform hover:scale-105 cursor-pointer"
        >
          <img
            src={user.profileImageUrl}
            alt="Foto de perfil"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <span className="text-lg">{user.name}</span>
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
