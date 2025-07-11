import { useNavigate } from 'react-router-dom';

export const MisCursos = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/alumno/dashboard')} className="back-btn">
          ← Volver al Dashboard
        </button>
        <h1>Mis Cursos</h1>
      </div>
      <div className="page-content">
        <p>Aquí van los cursos del alumno...</p>
        {/* Contenido específico de cursos */}
      </div>
    </div>
  );
};  