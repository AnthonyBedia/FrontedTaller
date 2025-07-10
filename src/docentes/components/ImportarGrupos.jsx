import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { grupoService } from '../services/grupoService';
import { alumnoService } from '../services/alumnoService';

const ImportarGrupos = ({ cursoSeleccionado, porCodigo, onImportacionCompletada }) => {
    const [mostrarDropImportar, setMostrarDropImportar] = useState(false);
    const fileInputRef = useRef(null);

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

            // Determinar si el archivo tiene el nuevo formato (con fila de título)
            let filaInicioCodigos = 0;
            let filaInicioDatos = 1;
            
            // Verificar si la primera fila contiene un título (como "Grupos de...")
            const primeraFila = jsonData[0];

                // Nuevo formato: primera fila es título, segunda fila son códigos
                filaInicioCodigos = 1;
                filaInicioDatos = 2;
                console.log('Detectado formato nuevo con título');
            

            // Obtener la fila de códigos de grupos
            const filaCodigos = jsonData[filaInicioCodigos];
            const columnasConContenido = filaCodigos
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

                    // 2. Obtener los datos de la columna (excluyendo las filas de título y códigos)
                    const datosColumna = [];
                    for (let fila = filaInicioDatos; fila < jsonData.length; fila++) {
                        const celda = jsonData[fila][indiceColumna];
                        if (celda && typeof celda === 'string' && celda.trim() !== '') {
                            datosColumna.push(celda.trim());
                        }
                    }

                    console.log(`Datos de la columna ${codigoGrupo}:`, datosColumna);

                    // 3. Buscar alumnos en cada celda de la columna
                    const alumnosEncontrados = [];
                    for (const contenidoCelda of datosColumna) {
                        if (porCodigo) {
                            // Buscar por código
                            const codigo = contenidoCelda.trim();
                            try {
                                const alumnocursoId = await alumnoService.buscarAlumnoPorCodigo(codigo, cursoSeleccionado.id);
                                if (alumnocursoId && alumnocursoId > 0) {
                                    alumnosEncontrados.push(alumnocursoId);
                                    console.log(`Alumno encontrado por código: ${codigo} (ID: ${alumnocursoId})`);
                                } else {
                                    console.log(`Alumno no encontrado por código: ${codigo}`);
                                }
                            } catch (error) {
                                console.error(`Error buscando alumno por código ${codigo}:`, error);
                            }
                        } else {
                            // Buscar por nombres y apellidos (lógica original)
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

            // Notificar que la importación se completó
            if (onImportacionCompletada) {
                onImportacionCompletada();
            }

            alert('Importación completada exitosamente');

        } catch (error) {
            console.error('Error procesando archivo Excel:', error);
            alert('Error procesando el archivo Excel: ' + error.message);
        }
    };

    return (
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
    );
};

export default ImportarGrupos; 