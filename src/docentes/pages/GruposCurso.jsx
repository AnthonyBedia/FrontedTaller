import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import TablaGrupos from '../components/TablaGrupos';
import BusquedaCursos from '../components/BusquedaCursos';
import MenuContextual from '../components/MenuContextual';
import { grupoService } from '../services/grupoService';
import { alumnoService } from '../services/alumnoService';

const GruposCurso = () => {
    const { cursoSeleccionado } = useSelector(state => state.docenteCurso);
    const [alumnos, setAlumnos] = useState([]);
    const [gruposAlumnos, setGruposAlumnos] = useState({});
    const [gruposInfo, setGruposInfo] = useState({});
    const [gruposDisponibles, setGruposDisponibles] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [mostrarSugerenciasGrupos, setMostrarSugerenciasGrupos] = useState(false);
    const [mostrarDropImportar, setMostrarDropImportar] = useState(false);
    
    // Estados para el menú contextual
    const [menuContextual, setMenuContextual] = useState({
        mostrar: false,
        x: 0,
        y: 0,
        tipo: '', // 'alumno' o 'grupo'
        datos: null
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        const obtenerDatos = async () => {
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
                        // 3. Obtener grupos para cada alumno individualmente para mantener el orden correcto
                        const gruposMap = {};
                        const gruposInfoMap = {};

                        // Obtener grupos uno por uno para mantener el orden correcto
                        for (let i = 0; i < alumnosArray.length; i++) {
                            const alumno = alumnosArray[i];
                            try {
                                const grupoData = await grupoService.getGrupoByAlumnoIdAndCursoId(alumno.id, cursoSeleccionado.id);
                                if (grupoData && grupoData.id) {
                                    gruposMap[alumno.id] = grupoData.id;
                                    gruposInfoMap[grupoData.id] = grupoData.codigo;
                                }
                                // Si no hay grupo, no se asigna nada (queda como undefined)
                            } catch (error) {
                                console.error(`Error obteniendo grupo para alumno ${alumno.id}:`, error);
                            }
                        }

                        setGruposAlumnos(gruposMap);
                        setGruposInfo(gruposInfoMap);
                    }
                } catch (error) {
                    console.error('Error al obtener datos:', error.response || error);
                    setAlumnos([]);
                    setGruposAlumnos({});
                    setGruposInfo({});
                    setGruposDisponibles([]);
                }
            } else {
                setAlumnos([]);
                setGruposAlumnos({});
                setGruposInfo({});
                setGruposDisponibles([]);
                setGrupoSeleccionado(null);
            }
        };

        obtenerDatos();
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

    const handleOpcionMenu = (opcion) => {
        console.log(`Opción seleccionada: ${opcion}`, menuContextual.datos);
        // Aquí se implementarán las acciones específicas
        cerrarMenuContextual();
    };

    const handleExportar = () => {
        console.log('Exportando datos...');
        
        // Preparar datos para exportar con grupos en columnas horizontales
        const datosParaExportar = [];
        
        // Agrupar alumnos por grupo
        const alumnosPorGrupo = {};
        
        // Agregar alumnos sin grupo
        alumnosPorGrupo['Sin grupo'] = [];
        
        // Agregar grupos disponibles
        gruposDisponibles.forEach(grupo => {
            alumnosPorGrupo[grupo.codigo] = [];
        });
        
        // Distribuir alumnos en sus grupos correspondientes
        alumnos.forEach(alumno => {
            const grupoId = gruposAlumnos[alumno.id];
            const codigoGrupo = gruposInfo[grupoId] || 'Sin grupo';
            
            if (!alumnosPorGrupo[codigoGrupo]) {
                alumnosPorGrupo[codigoGrupo] = [];
            }
            
            alumnosPorGrupo[codigoGrupo].push(alumno);
        });
        
        // Obtener todos los códigos de grupos que tienen alumnos
        const gruposConAlumnos = Object.keys(alumnosPorGrupo).filter(codigo => 
            alumnosPorGrupo[codigo].length > 0
        );
        
        // Encontrar el número máximo de alumnos en cualquier grupo
        const maxAlumnos = Math.max(...gruposConAlumnos.map(codigo => 
            alumnosPorGrupo[codigo].length
        ));
        
        // Crear la estructura de datos para exportar
        // Primera fila: códigos de grupos
        const filaCodigos = gruposConAlumnos.map(codigo => codigo);
        datosParaExportar.push(filaCodigos);
        
        // Segunda fila: encabezados de columnas (repetidos para cada grupo)
        const filaEncabezados = gruposConAlumnos.map(() => 'Apellidos y Nombres');
        datosParaExportar.push(filaEncabezados);
        
        // Filas de alumnos
        for (let i = 0; i < maxAlumnos; i++) {
            const filaAlumnos = gruposConAlumnos.map(codigo => {
                const alumnosDelGrupo = alumnosPorGrupo[codigo];
                if (i < alumnosDelGrupo.length) {
                    const alumno = alumnosDelGrupo[i];
                    return `${alumno.apellidos || ''} , ${alumno.nombres || ''}`.trim();
                }
                return ''; // Celda vacía si no hay más alumnos en este grupo
            });
            datosParaExportar.push(filaAlumnos);
        }
        
        // Crear el workbook y worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(datosParaExportar);
        
        // Configurar anchos de columnas (una columna por grupo)
        const anchosColumnas = gruposConAlumnos.map(() => ({ width: 40 }));
        worksheet['!cols'] = anchosColumnas;
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumnos');
        XLSX.writeFile(workbook, `alumnos_${cursoSeleccionado?.nombre || 'curso'}.xlsx`);
    };

    const handleImportarClick = () => {
        setMostrarDropImportar(!mostrarDropImportar);
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            console.log('Archivo seleccionado:', file.name);
            await procesarArchivoExcel(file);
            setMostrarDropImportar(false);
        } else {
            alert('Por favor selecciona un archivo Excel (.xlsx)');
        }
        // Limpiar el input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                console.log('Archivo arrastrado:', file.name);
                await procesarArchivoExcel(file);
                setMostrarDropImportar(false);
            } else {
                alert('Por favor arrastra un archivo Excel (.xlsx)');
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const procesarArchivoExcel = async (file) => {
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length === 0) {
                alert('El archivo Excel está vacío');
                return;
            }

            // Obtener la primera fila (encabezados)
            const primeraFila = jsonData[0];
            const columnasConContenido = primeraFila
                .map((celda, index) => ({ valor: celda, indice: index }))
                .filter(item => item.valor && typeof item.valor === 'string' && item.valor.trim() !== '');

            console.log('Columnas con contenido:', columnasConContenido);

            // Procesar cada columna
            for (const columna of columnasConContenido) {
                const codigoGrupo = columna.valor.trim();
                const indiceColumna = columna.indice;

                console.log(`Procesando columna: ${codigoGrupo}`);

                // 1. Obtener el grupo por código y curso
                try {
                    const grupo = await grupoService.getGrupoByCodigoAndCursoId(codigoGrupo, cursoSeleccionado.id);
                    
                    if (!grupo || !grupo.id) {
                        console.log(`Grupo no encontrado: ${codigoGrupo}`);
                        continue; // Pasar a la siguiente columna
                    }

                    console.log(`Grupo encontrado: ${grupo.codigo} (ID: ${grupo.id})`);

                    // 2. Obtener los datos de la columna (excluyendo la primera fila)
                    const datosColumna = [];
                    for (let fila = 1; fila < jsonData.length; fila++) {
                        const celda = jsonData[fila][indiceColumna];
                        if (celda && typeof celda === 'string' && celda.trim() !== '') {
                            datosColumna.push(celda.trim());
                        }
                    }

                    console.log(`Datos de la columna ${codigoGrupo}:`, datosColumna);

                    // 3. Buscar alumnos en cada celda de la columna
                    const alumnosEncontrados = [];
                    for (const contenidoCelda of datosColumna) {
                        // Separar por coma
                        const partes = contenidoCelda.split(',').map(parte => parte.trim());
                        
                        if (partes.length >= 2) {
                            const apellido = partes[0];
                            const nombre = partes[1];
                            
                            try {
                                const alumnocursoId = await alumnoService.buscarAlumnoPorNombreApellido(nombre, apellido, cursoSeleccionado.id);
                                if (alumnocursoId && alumnocursoId > 0) {
                                    alumnosEncontrados.push(alumnocursoId);
                                    console.log(`Alumno encontrado: ${apellido}, ${nombre} (ID: ${alumnocursoId})`);
                                } else {
                                    console.log(`Alumno no encontrado: ${apellido}, ${nombre}`);
                                }
                            } catch (error) {
                                console.error(`Error buscando alumno ${apellido}, ${nombre}:`, error);
                            }
                        }
                    }

                    // 4. Si se encontraron alumnos, procesar el grupo
                    if (alumnosEncontrados.length > 0) {
                        console.log(`${alumnosEncontrados.length} alumnos encontrados para el grupo ${codigoGrupo}`);

                        try {
                            // 5. Vaciar el grupo
                            await grupoService.vaciarGrupo(grupo.id, cursoSeleccionado.id);
                            console.log(`Grupo ${codigoGrupo} vaciado`);

                            // 6. Agregar los alumnos encontrados al grupo
                            await grupoService.agregarAlumnosAGrupo(alumnosEncontrados, grupo.id);
                            console.log(`${alumnosEncontrados.length} alumnos agregados al grupo ${codigoGrupo}`);

                        } catch (error) {
                            console.error(`Error procesando grupo ${codigoGrupo}:`, error);
                            console.error('Detalles del error:', error.response?.data || error.message);
                            alert(`Error procesando grupo ${codigoGrupo}: ${error.message}`);
                        }
                    } else {
                        console.log(`No se encontraron alumnos válidos para el grupo ${codigoGrupo}`);
                    }

                } catch (error) {
                    console.error(`Error obteniendo grupo ${codigoGrupo}:`, error);
                }
            }

            // Recargar los datos después de la importación
            if (cursoSeleccionado) {
                const obtenerDatos = async () => {
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
                };

                obtenerDatos();
            }

            alert('Importación completada exitosamente');

        } catch (error) {
            console.error('Error procesando archivo Excel:', error);
            alert('Error procesando el archivo Excel: ' + error.message);
        }
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
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={handleExportar}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                                >
                                    Exportar
                                </button>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={handleImportarClick}
                                        style={{
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                                    >
                                        Importar
                                    </button>
                                    {mostrarDropImportar && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: 0,
                                                marginTop: '5px',
                                                backgroundColor: 'white',
                                                border: '2px dashed #007bff',
                                                borderRadius: '8px',
                                                padding: '20px',
                                                minWidth: '300px',
                                                zIndex: 1000,
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                            }}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                        >
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ 
                                                    fontSize: '3rem', 
                                                    color: '#007bff', 
                                                    marginBottom: '10px' 
                                                }}>
                                                    📁
                                                </div>
                                                <p style={{ 
                                                    margin: '0 0 15px 0', 
                                                    color: '#666',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    Arrastra aquí tu archivo Excel (.xlsx)
                                                </p>
                                                <p style={{ 
                                                    margin: '0 0 15px 0', 
                                                    color: '#999',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    o
                                                </p>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept=".xlsx"
                                                    onChange={handleFileSelect}
                                                    style={{ display: 'none' }}
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    style={{
                                                        backgroundColor: '#007bff',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 16px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    Seleccionar archivo
                                                </button>
                                            </div>
                                        </div>
                                    )}
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