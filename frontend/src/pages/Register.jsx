import api from "@/api/axios";
import React, { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // ✅ Vista previa antes de subir
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("bio", bio);
      formData.append("password", password);
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      // Enviar datos al backend
      const response = await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Registro exitoso:", response.data);
      setSuccessMessage("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al registrarse.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-teal-200 via-pink-200 to-orange-200">
      <form onSubmit={handleRegister} className="bg-white shadow-lg rounded-box px-8 py-6 max-w-md w-[20vw] mt-20">
        <h1 className="text-3xl font-title-text text-center text-neutral mb-6">Registro</h1>

        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2" htmlFor="name">Nombre:</label>
          <input
            id="name"
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2" htmlFor="email">Correo:</label>
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Biografía */}
        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2" htmlFor="bio">Biografía:</label>
          <textarea
            id="bio"
            placeholder="Cuéntanos sobre ti..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Imagen de Perfil - Subida de archivos */}
        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2" htmlFor="profileImage">Imagen de Perfil:</label>
          <input id="profileImage" type="file" onChange={handleFileChange} className="input input-bordered w-full" />
          {previewUrl && (
            <img src={previewUrl} alt="Vista previa" className="w-24 h-24 mt-4 rounded-full shadow-md" />
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2" htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Confirmar Contraseña */}
        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2" htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Mensajes */}
        {errorMessage && <p className="text-error text-sm text-center mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-success text-sm text-center mt-2">{successMessage}</p>}

        {/* Botón de Registro */}
        <button type="submit" className="btn btn-primary w-full mt-4">Registrarse</button>
      </form>
    </div>
  );
}