// src/alumno/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './FormStyle.css';


export const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Inicio de sesión exitoso');
        // Guardar token o redireccionar
        console.log(data);
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <label>Correo</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        <button type="submit">Iniciar Sesión</button>

        <div className="extra-options">
          <a href="#">¿Olvidaste tu contraseña?</a>
          <a href="#">¿No tienes cuenta? Regístrate</a>
        </div>
      </form>
    </div>
  );
};


export default Login;
