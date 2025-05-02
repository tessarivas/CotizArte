import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const fullProfileImageUrl = rawProfileImageUrl
      ? `http://localhost:3000${rawProfileImageUrl}` // ✅ Agregar dominio local
      : "/default-profile.png";
  
    setUser({
      name: localStorage.getItem("user") || "Usuario",
      email: localStorage.getItem("email") || "No disponible",
      bio: localStorage.getItem("bio") || "Sin biografía",
      profileImageUrl: fullProfileImageUrl, // ✅ Usar la URL completa
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
        <h1 className="text-3xl font-title-text text-neutral mb-4">Mi Cuenta</h1>

        {/* Verificar que hay usuario antes de mostrar contenido */}
        {user ? (
          <>
            {user.profileImageUrl && (
              <img src={user.profileImageUrl} alt="Foto de perfil" className="w-24 h-24 rounded-full mx-auto shadow-md" />
            )}
            <p className="text-2xl font-bold text-primary mt-4">{user.name}</p>
            <p className="text-md text-primary-content">{user.email}</p>
            {user.bio && <p className="mt-4 text-base-content italic">{user.bio}</p>}
            <button onClick={handleLogout} className="btn btn-error w-40 mt-6 text-white font-bold">
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
