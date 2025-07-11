import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './DashboardStyle.css';

export const AlumnoDashboard = () => {
  const navigate = useNavigate();
  const userCookie = Cookies.get('user');

  // Si no hay sesión, redirigir a login
  useEffect(() => {
    if (!userCookie) {
      navigate('/alumno/login');
    }
  }, [userCookie, navigate]);

  const user = userCookie ? JSON.parse(userCookie) : null;
  const nombre = user?.nombreVisualizar || 'Alumno';

  const menuOptions = [
    {
      title: 'Mis Cursos',
      description: 'Ver cursos inscritos y progreso',
      path: '/alumno/MisCursos',
      icon: '📚',
      color: 'bg-blue-500',
    },
    {
      title: 'Calificaciones',
      description: 'Consultar notas y evaluaciones',
      path: '/alumno/Calificaciones',
      icon: '📊',
      color: 'bg-green-500',
    },
    {
      title: 'Horarios',
      description: 'Ver horario de clases',
      path: '/alumno/Horarios',
      icon: '🕒',
      color: 'bg-purple-500',
    },
    {
      title: 'Perfil',
      description: 'Editar información personal',
      path: '/alumno/Perfil',
      icon: '👤',
      color: 'bg-orange-500',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove('user');
    navigate('/alumno/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hola, {nombre}</h1>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar Sesión
        </button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>¡Bienvenido de vuelta!</h2>
          <p>Selecciona una opción para continuar</p>
        </div>

        <div className="menu-grid">
          {menuOptions.map((option, index) => (
            <div
              key={index}
              className="menu-card"
              onClick={() => handleNavigation(option.path)}
            >
              <div className={`menu-icon ${option.color}`}>{option.icon}</div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
