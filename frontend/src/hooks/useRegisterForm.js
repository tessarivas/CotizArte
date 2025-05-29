import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

export default function useRegisterForm() {
  const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);

  // Manejadores de eventos
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    fileInputRef.current.value = "";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validaciones
  const validateForm = () => {
    const errors = {};

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

    return errors;
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

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

      setTimeout(() => {
        navigate("/login");
      }, 1500);
      setErrorMessages({});
    } catch (error) {
      setErrorMessages({
        general: error.response?.data?.message || "Error al registrarse.",
      });
    }
  };

  // Retornamos todos los estados y funciones que necesitaremos en el componente
  return {
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
    selectedFile,
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
    handleSubmit,
  };
}
