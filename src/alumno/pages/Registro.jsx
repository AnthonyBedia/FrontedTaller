import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch(urlBack + 'api-alumno/v1/auth/registro', {
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

      navigate('/alumno/login', {
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

  const styles = {
    pageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f4f4',
      padding: '1rem'
    },
    loginContainer: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '500px'
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    input: {
      padding: '0.5rem',
      border: '1px solid #ccc',
      borderRadius: '4px'
    },
    button: {
      padding: '0.75rem',
      backgroundColor: '#1976d2',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    spinner: {
      marginRight: '0.5rem',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      width: '14px',
      height: '14px',
      animation: 'spin 1s linear infinite',
      display: 'inline-block',
      verticalAlign: 'middle'
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      borderLeft: '4px solid #f44336',
      padding: '0.75rem',
      marginBottom: '1rem',
      borderRadius: '4px',
      color: '#333'
    },
    extraOptions: {
      fontSize: '0.9rem',
      color: '#666',
      textAlign: 'center',
      marginTop: '1rem'
    },
    link: {
      color: '#1976d2',
      textDecoration: 'none',
      marginLeft: '4px'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginContainer}>
        <form style={styles.loginForm} onSubmit={handleSubmit}>
          <h2>Registro de Alumno</h2>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Código de Alumno</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Ej: A12345678"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Ej: Juan Carlos"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Ej: Pérez Gómez"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Ej: prueba@prueba.com"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmar Contraseña</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Repite tu contraseña"
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            style={styles.button}
          >
            {isLoading ? (
              <>
                <span style={styles.spinner}></span>
                Registrando...
              </>
            ) : 'Registrarse'}
          </button>

          <div style={styles.extraOptions}>
            <span>¿Ya tienes cuenta?</span>
            <a href="/alumno/login" style={styles.link}>Inicia sesión aquí</a>
          </div>
        </form>
      </div>        
    </div>
  );
};
