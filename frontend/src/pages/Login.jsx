import api from "../api/axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const response = await api.post("/auth/login", { email, password });
  
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", response.data.user.name);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("bio", response.data.user.bio || ""); 
        localStorage.setItem("profileImageUrl", response.data.user.profileImageUrl || "");
  
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
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-box px-8 py-8 max-w-md w-[20vw]">
        <h1 className="text-4xl font-title-text text-center text-neutral mb-6">Iniciar Sesión</h1>
        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2 font-regular-text" htmlFor="email">
            Correo Electrónico:
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
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`input input-bordered w-full ${errorMessage ? "input-error" : ""}`}
            />
            <button 
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {errorMessage && <p className="text-error text-sm text-center mt-2">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary w-full mt-4">Iniciar Sesión</button>

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