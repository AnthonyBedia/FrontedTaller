import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
const urlBack = import.meta.env.VITE_APP_BACKEND_ALUMNO_URL;

export const Calificaciones = () => {
  const navigate = useNavigate();
  const [notas, setNotas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cookieUser = Cookies.get('user');
  const { codigoAlumno, nombreVisualizar } = cookieUser ? JSON.parse(cookieUser) : {};

  useEffect(() => {
    if (codigoAlumno) {
      fetch(urlBack + `api-alumno/v1/notas/${codigoAlumno}`)
        .then((res) => res.json())
        .then((data) => setNotas(data))
        .catch((err) => console.error('Error al obtener notas:', err));
    }
  }, [codigoAlumno]);

  if (!codigoAlumno || notas.length === 0)
    return <p style={{ padding: '2rem' }}>Cargando notas...</p>;

  const curso = notas[0]?.nombre;
  const periodo = notas[0]?.codigo;

  const n1 = notas.find(n => n.codigoNota === 'N1')?.nota ?? '—';
  const n2 = notas.find(n => n.codigoNota === 'N2')?.nota ?? '—';
  const n3 = notas.find(n => n.codigoNota === 'N3')?.nota ?? '—';
  const promedio = notas.find(n => n.codigoNota === 'PROM')?.nota ?? '—';

  const notasDetalles = notas.filter(n =>
    !['N1', 'N2', 'N3', 'PROM', 'EXFINAL', 'EXPARCIAL', 'EP', 'EF'].includes(n.codigoNota)
  );

  const styles = {
    pageContainer: {
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
    },
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem',
      gap: '1rem',
    },
    backBtn: {
      backgroundColor: '#2d6cdf',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.4rem 0.8rem',
      cursor: 'pointer',
    },
    pageContent: {},
    notasContainer: {
      backgroundColor: '#f0f7ff',
      padding: '2rem',
      maxWidth: '700px',
      margin: 'auto',
      borderRadius: '10px',
    },
    header: {
      backgroundColor: '#0d1f63',
      color: 'white',
      padding: '1rem',
      borderRadius: '20px',
      marginBottom: '1rem',
    },
    filtro: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
    },
    periodo: {
      backgroundColor: 'white',
      padding: '0.4rem 1rem',
      borderRadius: '999px',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      fontWeight: 'bold',
    },
    tarjetaCurso: {
      backgroundColor: 'white',
      padding: '1.2rem',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    detallesBtn: {
      backgroundColor: '#2d6cdf',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.3rem 0.8rem',
      marginLeft: '10px',
      cursor: 'pointer',
    },
    detallesBtnHover: {
      backgroundColor: '#1d4cc0',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '80%',
      padding: '20px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cerrarBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
    },
    tablaScroll: {
      overflowY: 'auto',
      marginTop: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
    },
    tablaDetalles: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.95rem',
    },
    thtd: {
      border: '1px solid #ccc',
      padding: '10px',
      textAlign: 'center',
    },
    th: {
      backgroundColor: '#f4f4f4',
    },
    emptyMessage: {
      marginTop: '10px',
      color: '#555',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.pageHeader}>
        <button onClick={() => navigate('/alumno/dashboard')} style={styles.backBtn}>
          ← Volver al Dashboard
        </button>
        <h1>Calificaciones</h1>
      </div>

      <div style={styles.pageContent}>
        <div style={styles.notasContainer}>
          <div style={styles.header}>
            <h2>Notas del alumno</h2>
            <p><strong>Código:</strong> {codigoAlumno}</p>
            <p><strong>Nombre:</strong> {nombreVisualizar}</p>
          </div>

          <div style={styles.filtro}>
            <span>Semestre:</span>
            <div style={styles.periodo}>{periodo}</div>
          </div>

          <div style={styles.tarjetaCurso}>
            <p><strong>Curso:</strong> {curso}</p>
            <p><strong>Promedio:</strong> {promedio}</p>
            <p>Examen Parcial - N1 (20%): <span>{n1}</span></p>
            <p>
              Evaluación continua - N2 (60%): <span>{n2}</span>
              <button style={styles.detallesBtn} onClick={() => setModalAbierto(true)}>
                🔍 Ver detalles
              </button>
            </p>
            <p>Examen Final - N3 (20%): <span>{n3}</span></p>
          </div>
        </div>

        {modalAbierto && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3>Detalles de Evaluaciones</h3>
                <button style={styles.cerrarBtn} onClick={() => setModalAbierto(false)}>✖</button>
              </div>
              {notasDetalles.length === 0 ? (
                <p style={styles.emptyMessage}>No hay notas adicionales.</p>
              ) : (
                <div style={styles.tablaScroll}>
                  <table style={styles.tablaDetalles}>
                    <thead>
                      <tr>
                        <th style={{ ...styles.thtd, ...styles.th }}>Código Nota</th>
                        <th style={{ ...styles.thtd, ...styles.th }}>Descripción</th>
                        <th style={{ ...styles.thtd, ...styles.th }}>Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notasDetalles.map((nota, idx) => (
                        <tr key={idx}>
                          <td style={styles.thtd}>{nota.codigoNota}</td>
                          <td style={styles.thtd}>{nota.descripcion}</td>
                          <td style={styles.thtd}>{nota.nota}</td>
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
