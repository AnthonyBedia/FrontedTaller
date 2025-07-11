import React from 'react';
import { useCurso } from '../components/CursoContext';

const CreacionCursos = ( {curso=null} ) => {

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
        Creación Cursos
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        {/* Panel Izquierdo - Lista de Cursos */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{
            color: '#2c3e50',
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '1.3rem'
          }}>
            Cursos
          </h3>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '1rem',
            marginBottom: '30px'
          }}>
            No presenta cursos registrados
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '3px solid #3498db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '2rem',
              color: '#3498db',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s'
            }}>
              +
            </div>
          </div>
        </div>

        {/* Panel Derecho - Registro de Curso */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{
            color: '#2c3e50',
            textAlign: 'center',
            marginTop: 0,
            marginBottom: '30px',
            fontSize: '1.3rem'
          }}>
            Registro de Curso
          </h3>

          {['Código', 'Asignatura', 'Sección', 'Semestre'].map(label => (
            <div key={label} style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                {label}:
              </label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e8eef7',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: '#f8f9fa',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ))}

          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginTop: '30px'
          }}>
            <button style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Cancelar
            </button>

            <button style={{
              backgroundColor: '#2c3e50',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Generar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreacionCursos;
