import api from '../api/axios'; // Importa la instancia de axios configurada
import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('HandleLogin ejecutado'); // Este debe aparecer
    try {
      const response = await api.post('/auth/login', { email, password }); // Enviar datos al endpoint
      console.log('Login exitoso:', response.data);

      // Aquí podrías almacenar el token recibido si tu backend devuelve uno
      localStorage.setItem('token', response.data.access_token);

      localStorage.setItem('token', response.data.access_token);
      console.log('Token almacenado:', localStorage.getItem('token')); // Verificar el token

      // Redirigir al usuario a su dashboard o alguna página principal
      window.location.href = '/';
    } catch (error) {
      // Manejo de errores
      setErrorMessage(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl mb-4">Iniciar Sesión</h1>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo:</label>
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};