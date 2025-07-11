import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BusquedaCursos from '../components/BusquedaCursos';

const DashboardCurso = () => {
    const { cursoSeleccionado } = useSelector(state => state.docenteCurso);
    const [grupal, setGrupal] = useState(false);

    return (
        <div style={{ padding: '30px' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
                Dashboard del Curso
            </h2>

            {/* Componente de búsqueda de cursos */}
            <BusquedaCursos 
                placeholder="Buscar curso para ver dashboard..."
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
                            Dashboard de {cursoSeleccionado.nombre}
                        </h3>
                        <p style={{ 
                            color: '#6c757d',
                            fontSize: '1rem',
                            marginBottom: '20px'
                        }}>
                            {grupal ? 'Modo Grupal' : 'Modo Individual'}
                        </p>
                        
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                                Información del Curso
                            </h4>
                            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                                Código: {cursoSeleccionado.codigo}
                            </p>
                            <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                                Máximo por grupo: {cursoSeleccionado.maxGrupo || 'No definido'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 20px', 
                        color: '#6c757d'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
                        <p>Selecciona un curso para ver el dashboard</p>
                        <p style={{ fontSize: '0.9rem', color: '#adb5bd' }}>
                            Usa el buscador de arriba para encontrar el curso
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCurso; 