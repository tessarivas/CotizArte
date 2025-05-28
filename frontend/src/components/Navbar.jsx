import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      
      const rawProfileImageUrl = localStorage.getItem("profileImageUrl");
      // ✅ Mejorar la lógica para URLs de Cloudinary
      let fullProfileImageUrl;
      
      if (!rawProfileImageUrl || rawProfileImageUrl === 'null') {
        fullProfileImageUrl = "/default-profile.webp";
      } else if (rawProfileImageUrl.startsWith('http')) {
        // Ya es una URL completa de Cloudinary
        fullProfileImageUrl = rawProfileImageUrl;
      } else {
        // URL relativa del servidor
        fullProfileImageUrl = `https://cotizarte-backend.onrender.com${rawProfileImageUrl}`;
      }

      setUser({
        name: localStorage.getItem("user") || "Usuario",
        email: localStorage.getItem("email") || "No disponible", 
        bio: localStorage.getItem("bio") || "Sin biografía disponible",
        profileImageUrl: fullProfileImageUrl,
      });
    };

    updateUserState();
    window.addEventListener("storage", updateUserState);
    return () => {
      window.removeEventListener("storage", updateUserState);
      document.body.classList.remove('overflow-y-scroll');
    };
  }, [location.pathname]);

  const handleProtectedRoute = (route) => {
    const token = localStorage.getItem("access_token");
    setIsMobileMenuOpen(false); // Cerrar menú móvil al navegar
    navigate(token ? route : "/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Definir las opciones del menú con sus rutas
  const navLinks = [
    { name: "Precios", path: "/pricing-profile" },
    { name: "Materiales", path: "/materials" },
    { name: "Clientes", path: "/clients" },
    { name: "Proyectos", path: "/projects" },
    { name: "Cotizaciones", path: "/quotes" },
  ];

  // Ajustar la clase del contenedor principal según la página
  const isHomePage = location.pathname === '/';
  
  return (
    <>
      <div className={`fixed w-full z-40 top-0 left-0 px-4 lg:px-10 py-4 lg:py-10 pointer-events-none ${isHomePage ? 'home-navbar' : ''}`}>
        <div className="max-w-screen-2xl mx-auto relative">
          {/* Logo */}
          <Link to="/" className="pointer-events-auto">
            <img
              src="/CotizArte_Logo_Chico.webp"
              alt="CotizArte Logo"
              className="w-8 lg:w-10 h-auto cursor-pointer transition-transform hover:scale-105 absolute left-0 top-0"
            />
          </Link>

          {/* Desktop Navbar */}
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

          {/* Mobile Menu Button */}
          <div className="absolute right-16 lg:right-0 top-0 lg:hidden pointer-events-auto">
            <button
              onClick={toggleMobileMenu}
              className="bg-white/60 backdrop-blur-lg p-2 rounded-full shadow-md hover:bg-white/80 transition"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop User Button */}
          <div className="absolute right-0 top-0 pointer-events-auto hidden lg:block">
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

          {/* Mobile User Button */}
          <div className="absolute right-0 top-0 pointer-events-auto lg:hidden">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-primary font-bold text-primary-content hover:text-white font-regular-text px-3 py-2 rounded-full shadow-md hover:bg-primary-content transition-transform hover:scale-105 cursor-pointer"
              >
                <img
                  src={user.profileImageUrl}
                  alt="Foto de perfil"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <span className="text-sm hidden sm:block">{user.name}</span>
              </button>
            ) : (
              <Link to="/login">
                <InteractiveHoverButton className="bg-gradient-to-br from-[#f28da9] to-[#f2b78d] font-bold text-white font-regular-text px-4 py-2 text-sm rounded-full shadow-md hover:bg-white hover:text-[#f28da9] transition">
                  Login
                </InteractiveHoverButton>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Content */}
          <div className="absolute top-0 right-0 w-72 h-full bg-white/95 backdrop-blur-lg shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <img
                src="/CotizArte_Logo_Chico.webp"
                alt="CotizArte Logo"
                className="w-8 h-auto"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-6">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleProtectedRoute(link.path)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-lg font-semibold transition ${
                        location.pathname === link.path
                          ? "bg-pink-300 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Info (if logged in) */}
            {user && (
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 bg-gradient-to-r from-pink-300 to-orange-300 text-white font-bold px-4 py-3 rounded-lg shadow-md hover:from-pink-400 hover:to-orange-400 transition"
                >
                  <img
                    src={user.profileImageUrl}
                    alt="Foto de perfil"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <div className="text-left">
                    <div className="text-sm font-bold">{user.name}</div>
                    <div className="text-xs opacity-90">Ver perfil</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}