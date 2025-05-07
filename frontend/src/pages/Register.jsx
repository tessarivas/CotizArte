import { Eye, EyeOff } from "lucide-react";
import useRegisterForm from "@/hooks/useRegisterForm";

export default function Register() {
  const {
    // Estados
    name,
    setName,
    email,
    setEmail,
    bio,
    setBio,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    previewUrl,
    errorMessages,
    successMessage,
    showPassword,
    showConfirmPassword,
    fileInputRef,
    
    // Funciones
    handleFileChange,
    handleRemoveImage,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit
  } = useRegisterForm();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-teal-200 via-pink-200 to-orange-200 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-box px-8 py-8 max-w-md w-[20vw] overflow-y-auto max-h-[90vh] mt-10"
      >
        <h1 className="text-4xl font-title-text text-center text-neutral mb-4">
          Registrate
        </h1>

        {/* Nombre */}
        <div className="mb-3">
          <label
            className="block text-base-content text-sm font-bold mb-1"
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
              errorMessages.name ? "border-error" : ""
            }`}
          />
          {errorMessages.name && (
            <p className="text-error text-xs">{errorMessages.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label
            className="block text-base-content text-sm font-bold mb-1"
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
              errorMessages.email ? "border-error" : ""
            }`}
          />
          {errorMessages.email && (
            <p className="text-error text-xs">{errorMessages.email}</p>
          )}
        </div>

        {/* Biografía */}
        <div className="mb-3">
          <label
            className="block text-base-content text-sm font-bold mb-1"
            htmlFor="bio"
          >
            Biografía (opcional):
          </label>
          <textarea
            id="bio"
            placeholder="Cuéntanos sobre ti..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="textarea textarea-bordered w-full text-sm h-20"
          />
        </div>

        {/* Imagen de Perfil */}
        <div className="mb-3">
          <label className="block text-base-content text-sm font-bold mb-1">
            Imagen de Perfil (opcional):
          </label>
          <div className="flex items-center">
            <div className="flex-grow">
              <input
                id="profileImage"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="file-input file-input-secondary file-input-sm w-full"
              />
            </div>
            {previewUrl && (
              <div className="ml-2 relative">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-2 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                >
                  X
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label
            className="block text-base-content text-sm font-bold mb-1"
            htmlFor="password"
          >
            *Contraseña:
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Debe tener al menos 8 caracteres, incluyendo un número, una mayúscula y una minúscula."
              className={`input input-bordered w-full pr-10 ${
                errorMessages.password ? "border-error" : ""
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff size={18} className="text-gray-400" />
              ) : (
                <Eye size={18} className="text-gray-400" />
              )}
            </button>
          </div>
          {errorMessages.password && (
            <p className="text-error text-xs">{errorMessages.password}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div className="mb-3">
          <label
            className="block text-base-content text-sm font-bold mb-1"
            htmlFor="confirmPassword"
          >
            *Confirmar Contraseña:
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`input input-bordered w-full pr-10 ${
                errorMessages.confirmPassword ? "border-error" : ""
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} className="text-gray-400" />
              ) : (
                <Eye size={18} className="text-gray-400" />
              )}
            </button>
          </div>
          {errorMessages.confirmPassword && (
            <p className="text-error text-xs">
              {errorMessages.confirmPassword}
            </p>
          )}
        </div>

        {/* Mensajes generales */}
        {errorMessages.general && (
          <p className="text-error text-xs text-center mt-2">
            {errorMessages.general}
          </p>
        )}
        {successMessage && (
          <p className="text-success text-xs text-center mt-2">
            {successMessage}
          </p>
        )}

        {/* Botón de Registro */}
        <button type="submit" className="btn btn-primary w-full mt-3">
          Registrarse
        </button>
      </form>
    </div>
  );
}