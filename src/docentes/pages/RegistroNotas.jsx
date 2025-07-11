import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { grupoService } from '../services/grupoService';
import { alumnoService } from '../services/alumnoService';
import { componenteService } from '../services/componenteService';
import { notaService } from '../services/notaService';
import BusquedaCursos from '../components/BusquedaCursos';

const RegistroNotas = () => {
    const [searchParams] = useSearchParams();
    const { cursoSeleccionado } = useSelector(state => state.docenteCurso);
    const [grupal, setGrupal] = useState(false);
    const [gruposDisponibles, setGruposDisponibles] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [hojas, setHojas] = useState([]);
    const [hojaSeleccionada, setHojaSeleccionada] = useState(null);
    const [mostrarSugerenciasHojas, setMostrarSugerenciasHojas] = useState(false);
    const [notas, setNotas] = useState({});
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Cargar datos cuando cambie el curso seleccionado
    useEffect(() => {
        const cargarDatos = async () => {
            if (cursoSeleccionado) {
                try {
                    // Cargar grupos disponibles
                    const gruposData = await grupoService.getGrupos(cursoSeleccionado.id);
                    const gruposArray = Array.isArray(gruposData) ? gruposData : [];
                    setGruposDisponibles(gruposArray);

                    // Cargar alumnos del curso
                    const alumnosData = await alumnoService.listarAlumnosPorCurso(cursoSeleccionado.id);
                    const alumnosArray = Array.isArray(alumnosData) ? alumnosData : [];
                    setAlumnos(alumnosArray);

                    // Cargar hojas del curso
                    const hojasData = await componenteService.getHojas(cursoSeleccionado.id);
                    const hojasArray = Array.isArray(hojasData) ? hojasData : [];
                    setHojas(hojasArray);
                } catch (error) {
                    console.error('Error cargando datos:', error);
                }
            }
        };

        cargarDatos();
    }, [cursoSeleccionado]);

    // Cargar notas cuando cambie la hoja seleccionada
    useEffect(() => {
        const cargarNotas = async () => {
            if (cursoSeleccionado && hojaSeleccionada) {
                try {
                    const datos = grupal ? gruposDisponibles : alumnos;
                    const notasTemp = {};

                    for (const item of datos) {
                        try {
                            if (grupal) {
                                // En modo grupal, usar promedio de grupo
                                const promedioData = await grupoService.getPromedioByGrupoId(
                                    item.id, 
                                    cursoSeleccionado.id, 
                                    hojaSeleccionada.id
                                );
                                notasTemp[item.id] = promedioData;
                            } else {
                                // En modo individual, usar nota específica
                                const notaData = await notaService.getNotaEspecifica(
                                    item.id, 
                                    cursoSeleccionado.id, 
                                    hojaSeleccionada.id
                                );
                                notasTemp[item.id] = notaData;
                            }
                        } catch (error) {
                            console.error(`Error cargando ${grupal ? 'promedio' : 'nota'} para ${item.id}:`, error);
                            notasTemp[item.id] = null;
                        }
                    }

                    setNotas(notasTemp);
                } catch (error) {
                    console.error('Error cargando notas:', error);
                }
            }
        };

        cargarNotas();
    }, [cursoSeleccionado, hojaSeleccionada, grupal, gruposDisponibles, alumnos]);

    // Manejar parámetros de URL al cargar el componente
    useEffect(() => {
        const modo = searchParams.get('modo');
        const alumnoId = searchParams.get('alumnoId');
        const alumnoNombre = searchParams.get('alumnoNombre');
        const alumnoCodigo = searchParams.get('alumnoCodigo');
        const grupoId = searchParams.get('grupoId');
        const grupoCodigo = searchParams.get('grupoCodigo');

        if (modo === 'individual' && alumnoId && alumnoNombre && alumnoCodigo) {
            setGrupal(false);
        } else if (modo === 'grupal' && grupoId && grupoCodigo) {
            setGrupal(true);
        }
    }, [searchParams]);

    const handleSeleccionHoja = (hoja) => {
        setHojaSeleccionada(hoja);
        setMostrarSugerenciasHojas(false);
    };

    const handleSeleccionGeneral = () => {
        setHojaSeleccionada(null);
        setMostrarSugerenciasHojas(false);
    };

    const handleImportar = () => {
        console.log('Función de importar - por implementar');
        // Aquí se implementaría la lógica de importar
    };

    const handleExportar = () => {
        if (!cursoSeleccionado || !hojaSeleccionada) {
            alert('Debe seleccionar un curso y una hoja para exportar');
            return;
        }

        const datos = grupal ? gruposDisponibles : alumnos;
        const tituloColumna = grupal ? 'Grupo' : 'Alumno';
        
        // Crear datos para Excel
        const excelData = [
            [tituloColumna, 'Nota']
        ];

        datos.forEach(item => {
            const nota = notas[item.id]?.nota || notas[item.id]?.promedio || '';
            const nombre = grupal ? item.codigo : `${item.apellidos}, ${item.nombres}`;
            excelData.push([nombre, nota]);
        });

        // Crear CSV
        const csvContent = excelData.map(row => row.join(',')).join('\n');
        
        // Crear y descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `notas_${cursoSeleccionado.nombre}_${hojaSeleccionada.descripcion}_${grupal ? 'grupal' : 'individual'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGuardar = () => {
        setShowSaveModal(true);
    };

    const handleConfirmarGuardar = () => {
        console.log('Guardando notas...');
        // Aquí se implementaría la lógica de guardar
        setShowSaveModal(false);
    };

    const handleCancelarGuardar = () => {
        setShowSaveModal(false);
    };

    // Renderizar tabla según el modo
    const renderTabla = () => {
        if (!cursoSeleccionado) return null;

        const datos = grupal ? gruposDisponibles : alumnos;
        const tituloColumna = grupal ? 'Grupo' : 'Alumno';

        if (datos.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                    {grupal ? 'No hay grupos disponibles' : 'No hay alumnos en este curso'}
                </div>
            );
        }

        return (
            <div style={{ marginTop: '20px' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.9rem'
                }}>
                    <thead>
                        <tr>
                            <th style={{
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #dee2e6',
                                textAlign: 'left',
                                fontWeight: 'bold'
                            }}>
                                {tituloColumna}
                            </th>
                            <th style={{
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #dee2e6',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                width: '80px'
                            }}>
                                {grupal ? 'Promedio' : 'Nota'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((item, index) => (
                            <tr key={item.id || index} style={{
                                borderBottom: '1px solid #f0f0f0'
                            }}>
                                <td style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    {grupal ? item.codigo : `${item.apellidos}, ${item.nombres}`}
                                </td>
                                <td style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #f0f0f0',
                                    textAlign: 'center'
                                }}>
                                    <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={notas[item.id]?.nota || notas[item.id]?.promedio || ''}
                                        onChange={(e) => {
                                            const valor = e.target.value;
                                            setNotas(prev => ({
                                                ...prev,
                                                [item.id]: {
                                                    ...prev[item.id],
                                                    [grupal ? 'promedio' : 'nota']: valor
                                                }
                                            }));
                                        }}
                                        style={{
                                            width: '50px',
                                            padding: '4px 6px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            fontSize: '0.9rem'
                                        }}
                                        placeholder="--"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

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

            {/* Selector de Hoja */}
            {cursoSeleccionado && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '20px', 
                    marginBottom: '30px',
                    marginTop: '20px'
                }}>
                    <h4 style={{ 
                        color: '#2c3e50', 
                        fontSize: '1.2rem', 
                        margin: 0 
                    }}>
                        Hoja:
                    </h4>
                    <div style={{ position: 'relative', minWidth: '300px' }}>
                        <input
                            type="text"
                            value={hojaSeleccionada ? hojaSeleccionada.descripcion : ''}
                            onChange={(e) => {
                                const valor = e.target.value;
                                if (valor === '') {
                                    setHojaSeleccionada(null);
                                    setMostrarSugerenciasHojas(false);
                                } else {
                                    setMostrarSugerenciasHojas(true);
                                }
                            }}
                            placeholder="Seleccionar hoja..."
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                width: '100%'
                            }}
                        />
                        
                        {/* Sugerencias de Hojas */}
                        {mostrarSugerenciasHojas && hojas.length > 0 && (
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
                                <div
                                    onClick={handleSeleccionGeneral}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f0f0f0',
                                        backgroundColor: '#f8f9fa',
                                        fontWeight: 'bold',
                                        color: '#6c757d'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                >
                                    General
                                </div>
                                {hojas.map((hoja) => (
                                    <div
                                        key={hoja.id}
                                        onClick={() => handleSeleccionHoja(hoja)}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f0f0f0',
                                            ':hover': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                    >
                                        {hoja.descripcion} - {hoja.codigo}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                marginTop: '20px',
                marginRight: '100px' // Espacio sobrante cerca del navbar
            }}>
                {cursoSeleccionado ? (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <h3 style={{ 
                                color: '#2c3e50', 
                                fontSize: '1.5rem',
                                marginBottom: '20px'
                            }}>
                                Notas de {cursoSeleccionado.nombre}
                            </h3>
                            <p style={{ 
                                color: '#6c757d',
                                fontSize: '1rem',
                                marginBottom: '20px'
                            }}>
                                {grupal ? 'Modo Grupal' : 'Modo Individual'}
                            </p>
                        </div>

                        {/* Botones de Importar/Exportar/Guardar */}
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginBottom: '20px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={handleImportar}
                                style={{
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                            >
                                📥 Importar
                            </button>
                            <button
                                onClick={handleExportar}
                                style={{
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
                            >
                                📤 Exportar
                            </button>
                            <button
                                onClick={handleGuardar}
                                style={{
                                    backgroundColor: '#ffc107',
                                    color: '#212529',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
                            >
                                💾 Guardar
                            </button>
                        </div>
                        
                        {/* Tabla de notas */}
                        {renderTabla()}
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

            {/* Modal de confirmación para guardar */}
            {showSaveModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 3000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{
                            color: '#2c3e50',
                            marginBottom: '15px',
                            fontSize: '1.2rem'
                        }}>
                            Confirmar guardado
                        </h3>
                        <p style={{
                            color: '#6c757d',
                            marginBottom: '20px',
                            fontSize: '1rem'
                        }}>
                            ¿Estás seguro de que quieres guardar los cambios?
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={handleCancelarGuardar}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    color: '#6c757d',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmarGuardar}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistroNotas;