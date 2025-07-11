import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './Calificaciones.css';
const urlBack = import.meta.env.VITE_APP_BACKEND_ALUMNO_URL;

export const Calificaciones = () => {
  const navigate = useNavigate();
  const [notas, setNotas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(true);

  const cookieUser = Cookies.get('user');
  const { codigoAlumno, nombreVisualizar } = cookieUser ? JSON.parse(cookieUser) : {};

  useEffect(() => {
    if (codigoAlumno) {
      fetch(urlBack+`api-alumno/v1/notas/${codigoAlumno}`)
        .then((res) => res.json())
        .then((data) => {
          setNotas(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error al obtener notas:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [codigoAlumno]);

  if (loading) {
    return <p style={{ padding: '2rem' }}>Cargando notas...</p>;
  }

  if (!codigoAlumno || notas.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button onClick={() => navigate('../dashboard')} className="back-btn">
            ← Volver al Dashboard
          </button>
          <h1>Calificaciones</h1>
        </div>
        <p style={{ padding: '2rem' }}>No se encontraron notas disponibles.</p>
      </div>
    );
  }

  const curso = notas[0]?.nombre;
  const periodo = notas[0]?.codigo;

  const n1 = notas.find(n => n.codigoNota === 'N1')?.nota ?? '—';
  const n2 = notas.find(n => n.codigoNota === 'N2')?.nota ?? '—';
  const n3 = notas.find(n => n.codigoNota === 'N3')?.nota ?? '—';
  const promedio = notas.find(n => n.codigoNota === 'PROM')?.nota ?? '—';

  // Excluir códigos: N1, N2, N3, PROM, EXFINAL, EXPARCIAL, EP, EF
  const notasDetalles = notas.filter(n =>
    !['N1', 'N2', 'N3', 'PROM', 'EXFINAL', 'EXPARCIAL', 'EP', 'EF'].includes(n.codigoNota)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('../dashboard')} className="back-btn">
          ← Volver al Dashboard
        </button>
        <h1>Calificaciones</h1>
      </div>

      <div className="page-content">
        <div className="notas-container">
          <div className="header">
            <h2>Notas del alumno</h2>
            <p><strong>Código:</strong> {codigoAlumno}</p>
            <p><strong>Nombre:</strong> {nombreVisualizar}</p>
          </div>

          <div className="filtro">
            <span>Semestre:</span>
            <div className="periodo">{periodo}</div>
          </div>

          <div className="tarjeta-curso">
            <p><strong>Curso:</strong> {curso}</p>
            <p><strong>Promedio:</strong> {promedio}</p>
            <p>Examen Parcial - N1 (20%): <span>{n1}</span></p>
            <p>Evaluación continua - N2 (60%): <span>{n2}</span>
              <button className="detalles-btn" onClick={() => setModalAbierto(true)}>
                🔍 Ver detalles
              </button>
            </p>
            <p>Examen Final - N3 (20%): <span>{n3}</span></p>
          </div>
        </div>

        {modalAbierto && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Detalles de Evaluaciones</h3>
                <button className="cerrar-btn" onClick={() => setModalAbierto(false)}>✖</button>
              </div>
              {notasDetalles.length === 0 ? (
                <p className="empty-message">No hay notas adicionales.</p>
              ) : (
                <div className="tabla-scroll">
                  <table className="tabla-detalles">
                    <thead>
                      <tr>
                        <th>Código Nota</th>
                        <th>Descripción</th>
                        <th>Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notasDetalles.map((nota, idx) => (
                        <tr key={idx}>
                          <td>{nota.codigoNota}</td>
                          <td>{nota.descripcion}</td>
                          <td>{nota.nota}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};