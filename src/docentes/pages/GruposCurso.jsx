import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TablaGrupos from '../components/TablaGrupos';
import BusquedaCursos from '../components/BusquedaCursos';
import MenuContextual from '../components/MenuContextual';
import ImportarGrupos from '../components/ImportarGrupos';
import ExportarGrupos from '../components/ExportarGrupos';
import { grupoService } from '../services/grupoService';
import { alumnoService } from '../services/alumnoService';

const GruposCurso = () => {
    const navigate = useNavigate();
    const { cursoSeleccionado } = useSelector(state => state.docenteCurso);
    const [alumnos, setAlumnos] = useState([]);
    const [gruposAlumnos, setGruposAlumnos] = useState({});
    const [gruposInfo, setGruposInfo] = useState({});
    const [gruposDisponibles, setGruposDisponibles] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [mostrarSugerenciasGrupos, setMostrarSugerenciasGrupos] = useState(false);
    const [porCodigo, setPorCodigo] = useState(false);
    const [maxAlumnosPorGrupo, setMaxAlumnosPorGrupo] = useState(5);
    
    // Estados para el menú contextual
    const [menuContextual, setMenuContextual] = useState({
        mostrar: false,
        x: 0,
        y: 0,
        tipo: '', // 'alumno' o 'grupo'
        datos: null
    });

    const fileInputRef = useRef(null);

    const recargarDatos = async () => {
        if (cursoSeleccionado) {
            try {
                // 1. Obtener grupos disponibles del curso
                const gruposDisponiblesData = await grupoService.getGrupos(cursoSeleccionado.id);
                const gruposDisponiblesArray = Array.isArray(gruposDisponiblesData) ? gruposDisponiblesData : [];
                setGruposDisponibles(gruposDisponiblesArray);

                // 2. Obtener alumnos del curso
                const alumnosData = await alumnoService.listarAlumnosPorCurso(cursoSeleccionado.id);
                const alumnosArray = Array.isArray(alumnosData) ? alumnosData : [];
                setAlumnos(alumnosArray);

                if (alumnosArray.length > 0) {
                    // 3. Obtener grupos para cada alumno individualmente
                    const gruposMap = {};
                    const gruposInfoMap = {};

                    for (let i = 0; i < alumnosArray.length; i++) {
                        const alumno = alumnosArray[i];
                        try {
                            const grupoData = await grupoService.getGrupoByAlumnoIdAndCursoId(alumno.id, cursoSeleccionado.id);
                            if (grupoData && grupoData.id) {
                                gruposMap[alumno.id] = grupoData.id;
                                gruposInfoMap[grupoData.id] = grupoData.codigo;
                            }
                        } catch (error) {
                            console.error(`Error obteniendo grupo para alumno ${alumno.id}:`, error);
                        }
                    }

                    setGruposAlumnos(gruposMap);
                    setGruposInfo(gruposInfoMap);
                }
            } catch (error) {
                console.error('Error al recargar datos:', error);
            }
        }
    };

    useEffect(() => {
        recargarDatos();
    }, [cursoSeleccionado]);

    const handleSeleccionGrupo = (grupo) => {
        setGrupoSeleccionado(grupo);
        setMostrarSugerenciasGrupos(false);
    };

    const handleContextMenu = (e, tipo, datos) => {
        e.preventDefault();
        setMenuContextual({
            mostrar: true,
            x: e.clientX,
            y: e.clientY,
            tipo,
            datos
        });
    };

    const cerrarMenuContextual = () => {
        setMenuContextual({
            mostrar: false,
            x: 0,
            y: 0,
            tipo: '',
            datos: null
        });
    };

    const handleOpcionMenu = async (opcion) => {
        console.log(`Opción seleccionada: ${opcion}`, menuContextual.datos);
        
        if (opcion === 'verNotas') {
            // Navegar a RegistroNotas con los datos seleccionados
            const params = new URLSearchParams();
            
            if (menuContextual.tipo === 'alumno') {
                // Navegar con alumno seleccionado
                params.append('alumnoId', menuContextual.datos.alumno.id);
                params.append('alumnoNombre', `${menuContextual.datos.alumno.apellidos}, ${menuContextual.datos.alumno.nombres}`);
                params.append('alumnoCodigo', menuContextual.datos.alumno.codigo);
                params.append('modo', 'individual');
            } else if (menuContextual.tipo === 'grupo') {
                // Navegar con grupo seleccionado
                params.append('grupoId', menuContextual.datos.grupoId);
                params.append('grupoCodigo', menuContextual.datos.codigo);
                params.append('modo', 'grupal');
            }
            
            navigate(`/docentes/registro-notas?${params.toString()}`);
        } else if (opcion === 'eliminarGrupo') {
            try {
                // Confirmar antes de eliminar
                const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar el grupo ${menuContextual.datos.codigo}?`);
                if (confirmar) {
                    await grupoService.eliminarGrupo(menuContextual.datos.grupoId);
                    console.log(`Grupo ${menuContextual.datos.codigo} eliminado exitosamente`);
                    // Recargar datos después de eliminar
                    recargarDatos();
                }
            } catch (error) {
                console.error('Error eliminando grupo:', error);
                alert(`Error eliminando grupo: ${error.message}`);
            }
        }
        
        cerrarMenuContextual();
    };

    const handleAgrupamientoAutomatico = () => {
        console.log('Agrupamiento automático - por implementar');
        // Aquí se implementará la lógica de agrupamiento automático
    };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.8rem', margin: 0 }}>
                    Gestión de grupos
                </h2>
            </div>
            
            <BusquedaCursos
                placeholder="Buscar curso para gestionar grupos..."
                label="Curso:"
            />

            {cursoSeleccionado && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <h4 style={{ color: '#2c3e50', fontSize: '1.8rem', margin: 0 }}>
                        Grupo:
                    </h4>
                    <div style={{ position: 'relative', minWidth: '300px' }}>
                        <input
                            type="text"
                            value={grupoSeleccionado ? grupoSeleccionado.codigo : ''}
                            onChange={(e) => {
                                const valor = e.target.value;
                                if (valor === '') {
                                    setGrupoSeleccionado(null);
                                    setMostrarSugerenciasGrupos(false);
                                } else {
                                    setMostrarSugerenciasGrupos(true);
                                }
                            }}
                            placeholder="Seleccionar grupo..."
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                width: '100%'
                            }}
                        />
                        {mostrarSugerenciasGrupos && gruposDisponibles.length > 0 && (
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
                                {gruposDisponibles.map((grupo) => (
                                    <div
                                        key={grupo.id}
                                        onClick={() => handleSeleccionGrupo(grupo)}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            ':hover': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }}
                                    >
                                        {grupo.codigo}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>máximo</span>
                        <input
                            type="number"
                            value={maxAlumnosPorGrupo}
                            onChange={(e) => setMaxAlumnosPorGrupo(parseInt(e.target.value) || 5)}
                            min="1"
                            max="50"
                            style={{
                                width: '60px',
                                padding: '6px 8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '0.9rem',
                                textAlign: 'center'
                            }}
                        />
                    </div>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '30px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    height: 'fit-content'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{ 
                            color: '#3498db', 
                            margin: 0
                        }}>
                            {cursoSeleccionado ? cursoSeleccionado.nombre : 'Seleccione un curso'}
                        </h3>
                        
                        {alumnos.length > 0 && (
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <ExportarGrupos
                                    cursoSeleccionado={cursoSeleccionado}
                                    alumnos={alumnos}
                                    gruposAlumnos={gruposAlumnos}
                                    gruposInfo={gruposInfo}
                                    gruposDisponibles={gruposDisponibles}
                                    porCodigo={porCodigo}
                                    maxAlumnosPorGrupo={maxAlumnosPorGrupo}
                                />
                                
                                <ImportarGrupos
                                    cursoSeleccionado={cursoSeleccionado}
                                    porCodigo={porCodigo}
                                    onImportacionCompletada={recargarDatos}
                                    maxGrupo={maxAlumnosPorGrupo}
                                />
                                
                                <button
                                    onClick={handleAgrupamientoAutomatico}
                                    style={{
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                                >
                                    Agrupamiento automático
                                </button>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>nombres</span>
                                    <div
                                        onClick={() => setPorCodigo(!porCodigo)}
                                        style={{
                                            width: '50px',
                                            height: '24px',
                                            backgroundColor: porCodigo ? '#007bff' : '#ccc',
                                            borderRadius: '12px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: 'white',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: '2px',
                                                left: porCodigo ? '28px' : '2px',
                                                transition: 'left 0.3s',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>código</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <TablaGrupos
                        alumnos={alumnos}
                        gruposAlumnos={gruposAlumnos}
                        gruposInfo={gruposInfo}
                        grupoSeleccionado={grupoSeleccionado}
                        handleContextMenu={handleContextMenu}
                    />
                </div>
            </div>

            <MenuContextual
                menuContextual={menuContextual}
                cerrarMenuContextual={cerrarMenuContextual}
                handleOpcionMenu={handleOpcionMenu}
            />
        </div>
    )
}

export default GruposCurso;