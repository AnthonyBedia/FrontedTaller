import { useState } from 'react';
import './registro.css';
import { useNavigate, Link } from 'react-router-dom';
const urlBack = import.meta.env.VITE_APP_BACKEND_ALUMNO_URL;

export const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    codigo: '',
    username: '',
    password: '',
    nombres: '',
    apellidos: '',
    passwordConfirm: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validaciones básicas
    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.username.includes('@')) {
      setError('El username debe ser un email válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(urlBack+'api-alumno/v1/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo: formData.codigo,
          username: formData.username,
          password: formData.password,
          nombres: formData.nombres,
          apellidos: formData.apellidos
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      // Registro exitoso - redirigir a login con estado usando ruta relativa
      navigate('../login', {
        state: { 
          registrationSuccess: true,
          username: formData.username 
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Registro de Alumno</h2>
          
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Código de Alumno</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Ej: A12345678"
            />
          </div>

          <div className="form-group">
            <label>Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Ej: Juan Carlos"
            />
          </div>

          <div className="form-group">
            <label>Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Ej: Pérez Gómez"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Ej: prueba@prueba.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Repite tu contraseña"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="login-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Registrando...
              </>
            ) : 'Registrarse'}
          </button>

          <div className="extra-options">
            <span>¿Ya tienes cuenta? </span>
            <Link to="../login">Inicia sesión aquí</Link>
          </div>
        </form>
      </div>        
    </div>
  );
};