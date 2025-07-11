import { Outlet, useNavigate } from 'react-router-dom';

export const AlumnoLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/alumno/login');
  };

  return (
    <div className="alumno-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h3>Portal Alumno</h3>
        </div>
        <ul className="active">
          <li onClick={() => navigate('/alumno/MisCursos')}>Mis Cursos 🌱</li>
          <li onClick={() => navigate('/alumno/calificaciones')}>Calificaciones 📝</li>
          <li onClick={() => navigate('/alumno/horarios')}>Horarios📅 </li>
          <li onClick={() => navigate('/alumno/perfil')}>Perfil📊</li>
        </ul>

      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
