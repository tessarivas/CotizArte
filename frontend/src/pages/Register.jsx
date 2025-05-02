import api from "@/api/axios";
import { useRef, useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({});
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
    const errors = {};

    // Validaciones manuales
    if (name.length < 2 || name.length > 50)
      errors.name = "El nombre debe tener entre 2 y 50 caracteres.";
    if (!email.includes("@") || !email.includes("."))
      errors.email = "Correo electrónico no válido.";
    if (
      password.length < 8 ||
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)
    ) {
      errors.password =
        "La contraseña debe tener al menos 8 caracteres, incluir un número, una mayúscula y una minúscula.";
    }
    if (password !== confirmPassword)
      errors.confirmPassword = "Las contraseñas no coinciden.";

    // Si hay errores, no enviar la solicitud
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
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
      setErrorMessages({});
    } catch (error) {
      setErrorMessages({
        general: error.response?.data?.message || "Error al registrarse.",
      });
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(""); // ✅ Vaciar la vista previa
    fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-teal-200 via-pink-200 to-orange-200">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-box px-8 py-6 max-w-md w-[20vw] mt-20"
      >
        <h1 className="text-3xl font-title-text text-center text-neutral mb-6">
          Registrate
        </h1>

        {/* Nombre */}
        <div className="mb-4">
          <label
            className="block text-base-content text-sm font-bold mb-2"
            htmlFor="name"
          >
            *Nombre:
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={`input input-bordered w-full ${
              errorMessages.name ? "border-red-500" : ""
            }`}
          />
          {errorMessages.name && (
            <p className="text-red-500 text-sm">{errorMessages.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-base-content text-sm font-bold mb-2"
            htmlFor="email"
          >
            *Correo Electrónico:
          </label>
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`input input-bordered w-full ${
              errorMessages.email ? "border-red-500" : ""
            }`}
          />
          {errorMessages.email && (
            <p className="text-red-500 text-sm">{errorMessages.email}</p>
          )}
        </div>

        {/* Biografía */}
        <div className="mb-4">
          <label
            className="block text-base-content text-sm font-bold mb-2"
            htmlFor="bio"
          >
            Biografía (opcional):
          </label>
          <textarea
            id="bio"
            placeholder="Cuéntanos sobre ti..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Imagen de Perfil */}
        <div className="mb-4">
          <label className="block text-base-content text-sm font-bold mb-2">
            Imagen de Perfil (opcional):
          </label>
          <div className="relative flex items-center">
            <input
              id="profileImage"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="file-input file-input-secondary w-full"
            />
            {previewUrl && (
              <button
                onClick={handleRemoveImage}
                className="absolute cursor-pointer right-5 top-12 text-red-500 hover:text-red-700 transition"
              >
                Eliminar
              </button>
            )}
          </div>
          {previewUrl && (
            <div className="flex flex-col pl-2 mt-5">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="w-24 h-24 rounded-full shadow-md"
              />
            </div>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label
            className="block text-base-content text-sm font-bold mb-2"
            htmlFor="password"
          >
            *Contraseña:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Debe tener al menos 8 caracteres, incluyendo un número, una mayúscula y una minúscula."
            className={`input input-bordered w-full ${
              errorMessages.password ? "border-red-500" : ""
            }`}
          />
          {errorMessages.password && (
            <p className="text-red-500 text-sm">{errorMessages.password}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div className="mb-4">
          <label
            className="block text-base-content text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            *Confirmar Contraseña:
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`input input-bordered w-full ${
              errorMessages.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errorMessages.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errorMessages.confirmPassword}
            </p>
          )}
        </div>

        {/* Mensajes generales */}
        {errorMessages.general && (
          <p className="text-error text-sm text-center mt-2">
            {errorMessages.general}
          </p>
        )}
        {successMessage && (
          <p className="text-success text-sm text-center mt-2">
            {successMessage}
          </p>
        )}

        {/* Botón de Registro */}
        <button type="submit" className="btn btn-primary w-full mt-4">
          Registrarse
        </button>
      </form>
    </div>
  );
}
