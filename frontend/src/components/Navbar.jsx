import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la URL actual

  useEffect(() => {
    // Solo aplicamos la scrollbar visible si NO estamos en la página home
    if (location.pathname !== '/') {
      document.body.classList.add('overflow-y-scroll');
    } else {
      document.body.classList.remove('overflow-y-scroll');
    }
    
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
        : "/default-profile.jpg";

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
      // Remover la clase si se desmonta el componente
      document.body.classList.remove('overflow-y-scroll');
    };
  }, [location.pathname]); // Dependencia para que se ejecute cuando cambia la ruta

  const handleProtectedRoute = (route) => {
    const token = localStorage.getItem("access_token");
    navigate(token ? route : "/login");
  };

  // Definir las opciones del menú con sus rutas
  const navLinks = [
    { name: "Cotizaciones", path: "/quotes" },
    { name: "Proyectos", path: "/projects" },
    { name: "Clientes", path: "/clients" },
    { name: "Materiales", path: "/materials" },
    { name: "Precios", path: "/pricing-profile" },
  ];

  // Ajustar la clase del contenedor principal según la página
  const isHomePage = location.pathname === '/';
  
  return (
    <div className={`fixed w-full z-40 top-0 left-0 px-10 py-10 pointer-events-none ${isHomePage ? 'home-navbar' : ''}`}>
      <div className="max-w-screen-2xl mx-auto relative">
        {/* Logo */}
        <Link to="/" className="pointer-events-auto">
          <img
            src="/CotizArte_Logo_Chico.png"
            alt="CotizArte Logo"
            className="w-10 h-auto cursor-pointer transition-transform hover:scale-105 absolute left-0 top-0"
          />
        </Link>

        {/* Navbar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bg-white/60 backdrop-blur-lg shadow-xl rounded-4xl px-2 py-2 hidden lg:flex pointer-events-auto">
          <ul className="flex w-full justify-around items-center text-lg font-bold text-neutral font-regular-text gap-5">
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
        <div className="absolute right-0 top-0 pointer-events-auto">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 bg-primary font-bold text-primary-content hover:text-white font-regular-text px-6 py-3 rounded-full shadow-md hover:bg-primary-content transition-transform hover:scale-105 cursor-pointer"
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
              <InteractiveHoverButton className="bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold text-white font-regular-text px-6 py-4 rounded-full shadow-md hover:bg-white hover:text-[#f28da9] transition">
                Iniciar Sesión
              </InteractiveHoverButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}