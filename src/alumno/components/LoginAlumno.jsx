import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './FormStyle.css';
const urlBack = import.meta.env.VITE_APP_BACKEND_ALUMNO_URL;

export const LoginAlumno = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(urlBack+'api-alumno/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const rawData = await response.text();

      if (!response.ok) {
        try {
          const errJson = JSON.parse(rawData);
          throw new Error(errJson.detail || 'Credenciales incorrectas');
        } catch {
          throw new Error(rawData || 'Error en la autenticación');
        }
      }

      const userData = JSON.parse(rawData);

      // Validar que venga todo lo necesario
      if (!userData.username || !userData.nombreVisualizar || !userData.codigoAlumno) {
        throw new Error('Datos de usuario incompletos en la respuesta.');
      }

      // Guardar en cookie
      Cookies.set('user', JSON.stringify({
        username: userData.username,
        nombreVisualizar: userData.nombreVisualizar,
        codigoAlumno: userData.codigoAlumno
      }), { expires: 1 }); // Cookie válida por 1 día

      navigate('/alumno/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      setError(
        error.message.includes('Credenciales incorrectas')
          ? error.message
          : 'Usuario o contraseña inválidos'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión - Alumno</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Ingresa tu nombre de usuario"
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        <div className="extra-options">
          <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
          <a href="/alumno/registro">¿No tienes cuenta? Regístrate</a>
        </div>
      </form>
    </div>
  );
};
