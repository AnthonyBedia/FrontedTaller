import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { grupoService } from '../services/grupoService';
import { alumnoService } from '../services/alumnoService';
import BusquedaCursos from '../components/BusquedaCursos';

const RegistroNotas = () => {
    const { cursoSeleccionado } = useSelector(state => state.docenteCurso);
    const [grupal, setGrupal] = useState(false);

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
                Registro de Notas
            </h2>

            {/* Componente de búsqueda de cursos */}
            <BusquedaCursos 
                placeholder="Buscar curso para registrar notas..."
                label="Curso:"
            />

            {/* Interruptor Individual/Grupal */}
            <div style={{
                position: 'absolute',
                top: '100px',
                right: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'white',
                padding: '8px 12px',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #ddd'
            }}>
                <span style={{
                    fontSize: '0.9rem',
                    color: grupal ? '#6c757d' : '#2c3e50',
                    fontWeight: grupal ? 'normal' : 'bold'
                }}>
                    Individual
                </span>
                <div
                    onClick={() => setGrupal(!grupal)}
                    style={{
                        width: '50px',
                        height: '24px',
                        backgroundColor: grupal ? '#3498db' : '#bdc3c7',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background-color 0.3s'
                    }}
                >
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: grupal ? '28px' : '2px',
                        transition: 'left 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                </div>
                <span style={{
                    fontSize: '0.9rem',
                    color: grupal ? '#2c3e50' : '#6c757d',
                    fontWeight: grupal ? 'bold' : 'normal'
                }}>
                    Grupal
                </span>
            </div>

            {/* Contenido principal */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                minHeight: '400px',
                marginTop: '20px'
            }}>
                {cursoSeleccionado ? (
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ 
                            color: '#2c3e50', 
                            fontSize: '1.5rem',
                            marginBottom: '20px'
                        }}>
                            Notas de {cursoSeleccionado.nombre}
                        </h3>
                        <p style={{ 
                            color: '#6c757d',
                            fontSize: '1rem'
                        }}>
                            {grupal ? 'Modo Grupal' : 'Modo Individual'}
                        </p>
                    </div>
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 20px', 
                        color: '#6c757d'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
                        <p>Selecciona un curso para registrar las notas</p>
                        <p style={{ fontSize: '0.9rem', color: '#adb5bd' }}>
                            Usa el buscador de arriba para encontrar el curso
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistroNotas;