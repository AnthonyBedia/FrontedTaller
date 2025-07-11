import * as XLSX from 'xlsx';

const ExportarGrupos = ({ cursoSeleccionado, alumnos, gruposAlumnos, gruposInfo, gruposDisponibles, porCodigo, maxAlumnosPorGrupo }) => {
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
        // Primera fila: celda fusionada con el título del curso
        const filaTitulo = [`Grupos de ${cursoSeleccionado?.nombre || 'Curso'}`];
        datosParaExportar.push(filaTitulo);
        
        // Segunda fila: códigos de grupos
        const filaCodigos = gruposConAlumnos.map(codigo => codigo);
        datosParaExportar.push(filaCodigos);
        
        // Tercera fila: encabezados de columnas (repetidos para cada grupo)
        const filaEncabezados = gruposConAlumnos.map(() => porCodigo ? 'Código' : 'Apellidos y Nombres');
        datosParaExportar.push(filaEncabezados);
        
        // Filas de alumnos
        for (let i = 0; i < maxAlumnos; i++) {
            const filaAlumnos = gruposConAlumnos.map(codigo => {
                const alumnosDelGrupo = alumnosPorGrupo[codigo];
                if (i < alumnosDelGrupo.length) {
                    const alumno = alumnosDelGrupo[i];
                    if (porCodigo) {
                        return alumno.codigo || '';
                    } else {
                        return `${alumno.apellidos || ''} , ${alumno.nombres || ''}`.trim();
                    }
                }
                return ''; // Celda vacía si no hay más alumnos en este grupo
            });
            datosParaExportar.push(filaAlumnos);
        }
        
        // Crear el workbook y worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(datosParaExportar);
        
        // Configurar la celda fusionada para el título
        worksheet['!merges'] = [{
            s: { r: 0, c: 0 }, // Inicio: fila 0, columna 0
            e: { r: 0, c: gruposConAlumnos.length - 1 } // Fin: fila 0, última columna
        }];
        
        // Configurar anchos de columnas (una columna por grupo)
        const anchosColumnas = gruposConAlumnos.map(() => ({ width: 40 }));
        worksheet['!cols'] = anchosColumnas;
        
        // Configurar bordes para las celdas de grupos
        // Aplicar bordes a las celdas de grupos desde la fila 1 hasta maxAlumnosPorGrupo+2
        const filasConBordes = maxAlumnosPorGrupo + 2;
        for (let fila = 1; fila <= filasConBordes; fila++) {
            for (let col = 0; col < gruposConAlumnos.length; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: fila, c: col });
                if (!worksheet[cellRef]) {
                    worksheet[cellRef] = { v: '' };
                }
                worksheet[cellRef].s = {
                    border: {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                };
            }
        }
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumnos');
        XLSX.writeFile(workbook, `alumnos_${cursoSeleccionado?.nombre || 'curso'}.xlsx`);
    };

    return (
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
    );
};

export default ExportarGrupos; 