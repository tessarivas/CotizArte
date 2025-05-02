import api from "../api/axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const response = await api.post("/auth/login", { email, password });
  
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", response.data.user.name);
        localStorage.setItem("email", response.data.user.email); // ✅ Guardar email
        localStorage.setItem("bio", response.data.user.bio || ""); // ✅ Guardar bio
        localStorage.setItem("profileImageUrl", response.data.user.profileImageUrl || ""); // ✅ Guardar imagen
  
        window.location.href = "/dashboard";
      } else {
        throw new Error("No se recibió un token válido");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-teal-200 via-pink-200 to-orange-200">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-box px-8 py-6 max-w-md w-[20vw]">
        <h1 className="text-3xl font-title-text text-center text-neutral mb-6">Iniciar Sesión</h1>

        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2 font-regular-text" htmlFor="email">
            Correo:
          </label>
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`input input-bordered w-full ${errorMessage ? "input-error" : ""}`}
          />
        </div>

        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2 font-regular-text" htmlFor="password">
            Contraseña:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`input input-bordered w-full ${errorMessage ? "input-error" : ""}`}
          />
        </div>

        {errorMessage && <p className="text-error text-sm text-center mt-2">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary w-full mt-4">Iniciar Sesión</button>

        {/* Botón para registrarse */}
        <div className="text-center mt-4">
          <p className="text-sm text-base-content">
            ¿No estás registrado?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">Regístrate aquí</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
