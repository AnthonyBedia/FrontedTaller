import { useNavigate } from 'react-router-dom';

export const Horarios = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/alumno/dashboard')} className="back-btn">
          ← Volver al Dashboard
        </button>
        <h1>Horarios</h1>
      </div>
      <div className="page-content">
        <p>Aquí van las calificaciones del alumno...</p>
        {/* Contenido específico de calificaciones */}
      </div>
    </div>
  );
};