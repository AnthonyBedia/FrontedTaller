import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const AlumnoDashboard = () => {
  const navigate = useNavigate();
  const userCookie = Cookies.get('user');

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
      color: '#3b82f6' // bg-blue-500
    },
    {
      title: 'Calificaciones',
      description: 'Consultar notas y evaluaciones',
      path: '/alumno/Calificaciones',
      icon: '📊',
      color: '#22c55e' // bg-green-500
    },
    {
      title: 'Horarios',
      description: 'Ver horario de clases',
      path: '/alumno/Horarios',
      icon: '🕒',
      color: '#8b5cf6' // bg-purple-500
    },
    {
      title: 'Perfil',
      description: 'Editar información personal',
      path: '/alumno/Perfil',
      icon: '👤',
      color: '#f97316' // bg-orange-500
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove('user');
    navigate('/alumno/login');
  };

  const styles = {
    dashboardContainer: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    dashboardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    logoutBtn: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    dashboardContent: {
      padding: '2rem'
    },
    welcomeSection: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    menuGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    menuCard: {
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      textAlign: 'center'
    },
    menuCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
    },
    menuIcon: (color) => ({
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      fontSize: '2rem',
      color: 'white',
      backgroundColor: color
    })
  };

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.dashboardHeader}>
        <h1>Hola, {nombre}</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>

      <div style={styles.dashboardContent}>
        <div style={styles.welcomeSection}>
          <h2>¡Bienvenido de vuelta!</h2>
          <p>Selecciona una opción para continuar</p>
        </div>

        <div style={styles.menuGrid}>
          {menuOptions.map((option, index) => (
            <div
              key={index}
              style={styles.menuCard}
              onClick={() => handleNavigation(option.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.menuIcon(option.color)}>{option.icon}</div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
