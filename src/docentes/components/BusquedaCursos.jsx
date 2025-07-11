import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { grupoService } from '../services/grupoService';
import { setCursoSeleccionado, setBusqueda } from '../slices/cursoSlice';

const BusquedaCursos = ({ 
    placeholder = "Busca un curso",
    label = "Curso:"
}) => {
    const dispatch = useDispatch();
    const { cursoSeleccionado, busqueda } = useSelector(state => state.docenteCurso);
    
    const [cursos, setCursos] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const buscarCursos = async () => {
            if (busqueda.length >= 2) {
                try {
                    setCargando(true);
                    console.log('Buscando cursos con:', busqueda);
                    const response = await grupoService.buscarCursos(busqueda);
                    console.log('Respuesta del servidor:', response);
                    
                    if (Array.isArray(response)) {
                        setCursos(response);
                        setMostrarSugerencias(true);
                        console.log('Cursos encontrados:', response.length);
                    } else {
                        console.error('La respuesta no es un array:', response);
                        setCursos([]);
                        setMostrarSugerencias(false);
                    }
                } catch (error) {
                    console.error('Error al buscar cursos:', error);
                    console.error('Detalles del error:', error.response?.data || error.message);
                    setCursos([]);
                    setMostrarSugerencias(false);
                } finally {
                    setCargando(false);
                }
            } else {
                setCursos([]);
                setMostrarSugerencias(false);
                setCargando(false);
            }
        };

        const timeoutId = setTimeout(buscarCursos, 300);
        return () => clearTimeout(timeoutId);
    }, [busqueda]);

    const handleSeleccionCurso = (curso) => {
        dispatch(setCursoSeleccionado(curso));
        dispatch(setBusqueda(curso.nombre));
        setMostrarSugerencias(false);
    };

    const handleBusquedaChange = (e) => {
        dispatch(setBusqueda(e.target.value));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <h4 style={{ color: '#2c3e50', fontSize: '1.8rem', margin: 0 }}>
                {label}
            </h4>
            <div style={{ position: 'relative', minWidth: '300px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={handleBusquedaChange}
                        placeholder={placeholder}
                        style={{
                            padding: '8px 12px',
                            paddingRight: cargando ? '40px' : '12px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            width: '100%'
                        }}
                    />
                    {cargando && (
                        <div style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '12px',
                            color: '#666'
                        }}>
                            Buscando...
                        </div>
                    )}
                </div>
                {mostrarSugerencias && cursos.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        marginTop: '4px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {cursos.map((curso) => (
                            <div
                                key={curso.id}
                                onClick={() => handleSeleccionCurso(curso)}
                                style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    ':hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                {curso.nombre}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusquedaCursos; 