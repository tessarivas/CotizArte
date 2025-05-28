import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SparklesText } from "@/components/magicui/sparkles-text";

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const rawProfileImageUrl = localStorage.getItem("profileImageUrl");
    // ✅ Usar la misma lógica que el Navbar
    let fullProfileImageUrl;

    if (!rawProfileImageUrl || rawProfileImageUrl === "null") {
      fullProfileImageUrl = "/default-profile.webp";
    } else if (rawProfileImageUrl.startsWith("http")) {
      // Ya es una URL completa de Cloudinary
      fullProfileImageUrl = rawProfileImageUrl;
    } else {
      // URL relativa del servidor
      fullProfileImageUrl = `https://cotizarte-backend.onrender.com${rawProfileImageUrl}`;
    }

    setUser({
      name: localStorage.getItem("user") || "Usuario",
      email: localStorage.getItem("email") || "No disponible",
      bio: localStorage.getItem("bio") || "Sin biografía",
      profileImageUrl: fullProfileImageUrl,
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload(); // ✅ Refresca la página para que el Navbar se actualice
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-teal-200 via-pink-200 to-orange-200">
      <div className="bg-white shadow-lg rounded-box px-8 py-6 max-w-md w-[20vw] text-center">
        <SparklesText
          className={"text-center mb-6 text-5xl"}
          text="Mi Cuenta"
        />

        {/* Verificar que hay usuario antes de mostrar contenido */}
        {user ? (
          <>
            {/* ✅ Mostrar imagen siempre, incluso si es la default */}
            <img
              src={user.profileImageUrl}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full mx-auto shadow-md object-cover border-2 border-gray-200"
              onError={(e) => {
                // ✅ Fallback si la imagen falla al cargar
                e.target.src = "/default-profile.webp";
              }}
            />
            <p className="text-2xl font-bold text-primary mt-4">{user.name}</p>
            <p className="text-md text-primary-content">{user.email}</p>
            {user.bio && user.bio !== "Sin biografía" && (
              <p className="mt-4 text-base-content italic">{user.bio}</p>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-error w-40 mt-6 text-white font-bold"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <p className="text-neutral-content">Cargando datos...</p>
        )}
      </div>
    </div>
  );
}
