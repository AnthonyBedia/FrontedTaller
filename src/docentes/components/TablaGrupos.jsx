import React, { useState } from 'react';
import { grupoService } from '../services/grupoService';
import { alumnoService } from '../services/alumnoService';

const TablaGrupos = ({ 
    alumnos, 
    gruposAlumnos, 
    gruposInfo, 
    grupoSeleccionado, 
    handleContextMenu,
    cursoSeleccionado,
    onDatosActualizados,
    maxAlumnosPorGrupo = 5
}) => {
    const [dragData, setDragData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [draggedAlumnoId, setDraggedAlumnoId] = useState(null);
    const [grupoLleno, setGrupoLleno] = useState(false);

    const handleMouseDown = (e, alumno) => {
        console.log('Mouse down en alumno:', alumno);
        const dragDataObj = { alumno, startX: e.clientX, startY: e.clientY };
        console.log('dragData creado:', dragDataObj);
        setDragData(dragDataObj);
        setDraggedAlumnoId(alumno.id);
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (dragData) {
            const deltaX = Math.abs(e.clientX - dragData.startX);
            const deltaY = Math.abs(e.clientY - dragData.startY);
            
            // Si se ha movido más de 10px, considerar como drag
            if (deltaX > 10 || deltaY > 10) {
                setIsDragging(true);
                // Cambiar el cursor
                document.body.style.cursor = 'grabbing';
            }
        }
    };

    const handleMouseUp = async (e) => {
        console.log('Mouse up - dragData:', dragData);
        console.log('Mouse up - isDragging:', isDragging);
        
        if (dragData && isDragging) {
            const target = e.target.closest('td');
            console.log('Target encontrado:', target);
            
            if (target && target.getAttribute('data-tipo') === 'grupo') {
                const grupoId = target.getAttribute('data-grupo-id');
                console.log('Grupo objetivo:', grupoId);
                
                // Verificar si el grupo está lleno antes de permitir el arrastre
                try {
                    const cantidadAlumnos = await grupoService.countAlumnos(grupoId, cursoSeleccionado.id);
                    console.log(`Grupo ${grupoId} tiene ${cantidadAlumnos} alumnos, máximo: ${maxAlumnosPorGrupo}`);
                    
                    if (cantidadAlumnos >= maxAlumnosPorGrupo) {
                        console.log('Grupo lleno, no se puede agregar más alumnos');
                        setGrupoLleno(true);
                        setDragData({
                            ...dragData,
                            targetGrupo: grupoId
                        });
                        setModalPosition({ x: e.clientX, y: e.clientY });
                        setShowModal(true);
                    } else {
                        console.log('Grupo disponible para agregar alumno');
                        setGrupoLleno(false);
                        
                        // Actualizar dragData con el grupo objetivo
                        const updatedDragData = {
                            ...dragData,
                            targetGrupo: grupoId
                        };
                        console.log('updatedDragData:', updatedDragData);
                        setDragData(updatedDragData);
                        
                        // Mostrar modal de confirmación
                        setModalPosition({ x: e.clientX, y: e.clientY });
                        setShowModal(true);
                    }
                } catch (error) {
                    console.error('Error verificando cantidad de alumnos:', error);
                    alert('Error verificando el estado del grupo');
                }
            }
        }
        setIsDragging(false);
        setDraggedAlumnoId(null);
        // Restaurar el cursor
        document.body.style.cursor = 'default';
    };

    const handleConfirmarCambio = async () => {
        // Si el grupo está lleno, solo cerrar el modal
        if (grupoLleno) {
            setShowModal(false);
            setDragData(null);
            setGrupoLleno(false);
            return;
        }

        try {
            console.log('Confirmando cambio de grupo...');
            console.log('Alumno:', dragData?.alumno);
            console.log('Grupo objetivo:', dragData?.targetGrupo);
            
            if (dragData?.alumno && dragData?.targetGrupo && cursoSeleccionado) {
                // Buscar el alumnocursoId usando el código del alumno y el curso
                const alumnocursoId = await alumnoService.buscarAlumnoPorCodigoyCurso(dragData.alumno.codigo, cursoSeleccionado.id);
                
                if (alumnocursoId && alumnocursoId > 0) {
                    // Llamar al servicio para agregar alumno al grupo
                    await grupoService.agregarAlumnosAGrupo([alumnocursoId], dragData.targetGrupo);
                    console.log('Alumno agregado al grupo exitosamente');
                    
                    // Notificar que los datos se han actualizado
                    if (onDatosActualizados) {
                        onDatosActualizados();
                    }
                } else {
                    console.error('No se encontró el alumnocursoId');
                    alert('Error: No se pudo encontrar el alumno en el curso');
                }
            } else {
                console.error('Datos faltantes para el cambio de grupo');
                console.log('dragData:', dragData);
                console.log('cursoSeleccionado:', cursoSeleccionado);
            }
        } catch (error) {
            console.error('Error al cambiar grupo:', error);
            alert(`Error al cambiar grupo: ${error.message}`);
        }
        setShowModal(false);
        setDragData(null);
        setGrupoLleno(false);
    };

    const handleCancelarCambio = () => {
        console.log('Cancelando cambio de grupo');
        setShowModal(false);
        setDragData(null);
        setGrupoLleno(false);
    };

    const renderGruposTable = () => {
        if (!alumnos.length) return null;

        // Filtrar alumnos por grupo seleccionado si hay uno seleccionado
        let alumnosAMostrar = alumnos;
        if (grupoSeleccionado) {
            alumnosAMostrar = alumnos.filter(alumno => gruposAlumnos[alumno.id] === grupoSeleccionado.id);
        }

        if (alumnosAMostrar.length === 0) {
            return (
                <tr>
                    <td colSpan="2" style={{
                        padding: '12px',
                        textAlign: 'center',
                        color: '#6c757d'
                    }}>
                        {grupoSeleccionado 
                            ? `No hay alumnos en el grupo ${grupoSeleccionado.codigo}` 
                            : 'No hay alumnos en este curso'
                        }
                    </td>
                </tr>
            );
        }

        const rows = [];
        let currentGroupId = null;
        let rowspan = 1;
        let startIndex = 0;

        for (let i = 0; i < alumnosAMostrar.length; i++) {
            const alumno = alumnosAMostrar[i];
            const grupoId = gruposAlumnos[alumno.id];

            if (i === 0) {
                currentGroupId = grupoId;
                startIndex = 0;
            }

            if (i > 0 && grupoId === currentGroupId) {
                rowspan++;
            } else {
                if (i > 0) {
                    rows.push(
                        <tr key={`group-${startIndex}`}>
                            <td 
                                rowSpan={rowspan} 
                                data-tipo="grupo"
                                data-grupo-id={currentGroupId}
                                style={{
                                    padding: '12px',
                                    borderBottom: '1px solid #dee2e6',
                                    backgroundColor: '#f8f9fa',
                                    cursor: 'context-menu'
                                }}
                                onContextMenu={(e) => handleContextMenu(e, 'grupo', {
                                    grupoId: currentGroupId,
                                    codigo: gruposInfo[currentGroupId]
                                })}
                            >
                                {gruposInfo[currentGroupId] || 'Sin grupo'}
                            </td>
                            <td 
                                style={{
                                    padding: '12px',
                                    borderBottom: '1px solid #dee2e6',
                                    cursor: isDragging && draggedAlumnoId === alumnosAMostrar[startIndex].id ? 'grabbing' : 'context-menu',
                                    backgroundColor: isDragging && draggedAlumnoId === alumnosAMostrar[startIndex].id ? '#e3f2fd' : 'transparent'
                                }}
                                onContextMenu={(e) => handleContextMenu(e, 'alumno', {
                                    alumno: alumnosAMostrar[startIndex],
                                    grupoId: currentGroupId
                                })}
                                onMouseDown={(e) => handleMouseDown(e, alumnosAMostrar[startIndex])}
                            >
                                {`${alumnosAMostrar[startIndex].nombres} ${alumnosAMostrar[startIndex].apellidos}`}
                            </td>
                        </tr>
                    );

                    for (let j = startIndex + 1; j < i; j++) {
                        rows.push(
                            <tr key={`alumno-${j}`}>
                                <td 
                                    style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #dee2e6',
                                        cursor: isDragging && draggedAlumnoId === alumnosAMostrar[j].id ? 'grabbing' : 'context-menu',
                                        backgroundColor: isDragging && draggedAlumnoId === alumnosAMostrar[j].id ? '#e3f2fd' : 'transparent'
                                    }}
                                    onContextMenu={(e) => handleContextMenu(e, 'alumno', {
                                        alumno: alumnosAMostrar[j],
                                        grupoId: currentGroupId
                                    })}
                                    onMouseDown={(e) => handleMouseDown(e, alumnosAMostrar[j])}
                                >
                                    {`${alumnosAMostrar[j].nombres} ${alumnosAMostrar[j].apellidos}`}
                                </td>
                            </tr>
                        );
                    }
                }

                currentGroupId = grupoId;
                startIndex = i;
                rowspan = 1;
            }

            if (i === alumnosAMostrar.length - 1) {
                rows.push(
                    <tr key={`group-${startIndex}`}>
                        <td 
                            rowSpan={rowspan} 
                            data-tipo="grupo"
                            data-grupo-id={currentGroupId}
                            style={{
                                padding: '12px',
                                borderBottom: '1px solid #dee2e6',
                                backgroundColor: '#f8f9fa',
                                cursor: 'context-menu'
                            }}
                            onContextMenu={(e) => handleContextMenu(e, 'grupo', {
                                grupoId: currentGroupId,
                                codigo: gruposInfo[currentGroupId]
                            })}
                        >
                            {gruposInfo[currentGroupId] || 'Sin grupo'}
                        </td>
                        <td 
                            style={{
                                padding: '12px',
                                borderBottom: '1px solid #dee2e6',
                                cursor: isDragging && draggedAlumnoId === alumnosAMostrar[startIndex].id ? 'grabbing' : 'context-menu',
                                backgroundColor: isDragging && draggedAlumnoId === alumnosAMostrar[startIndex].id ? '#e3f2fd' : 'transparent'
                            }}
                            onContextMenu={(e) => handleContextMenu(e, 'alumno', {
                                alumno: alumnosAMostrar[startIndex],
                                grupoId: currentGroupId
                            })}
                            onMouseDown={(e) => handleMouseDown(e, alumnosAMostrar[startIndex])}
                        >
                            {`${alumnosAMostrar[startIndex].nombres} ${alumnosAMostrar[startIndex].apellidos}`}
                        </td>
                    </tr>
                );

                for (let j = startIndex + 1; j <= i; j++) {
                    rows.push(
                        <tr key={`alumno-${j}`}>
                            <td 
                                style={{
                                    padding: '12px',
                                    borderBottom: '1px solid #dee2e6',
                                    cursor: isDragging && draggedAlumnoId === alumnosAMostrar[j].id ? 'grabbing' : 'context-menu',
                                    backgroundColor: isDragging && draggedAlumnoId === alumnosAMostrar[j].id ? '#e3f2fd' : 'transparent'
                                }}
                                onContextMenu={(e) => handleContextMenu(e, 'alumno', {
                                    alumno: alumnosAMostrar[j],
                                    grupoId: currentGroupId
                                })}
                                onMouseDown={(e) => handleMouseDown(e, alumnosAMostrar[j])}
                            >
                                {`${alumnosAMostrar[j].nombres} ${alumnosAMostrar[j].apellidos}`}
                            </td>
                        </tr>
                    );
                }
            }
        }

        return rows;
    };

    return (
        <>
            <div 
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '20px'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                }}>
                    <thead>
                        <tr>
                            <th style={{
                                padding: '12px',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #dee2e6',
                                textAlign: 'left'
                            }}>
                                Grupo
                            </th>
                            <th style={{
                                padding: '12px',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #dee2e6',
                                textAlign: 'left'
                            }}>
                                Alumno
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.length > 0 ? (
                            renderGruposTable()
                        ) : (
                            <tr>
                                <td colSpan="2" style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    color: '#6c757d'
                                }}>
                                    {alumnos.length === 0 && grupoSeleccionado ? 'No hay alumnos en este curso' : 'Seleccione un curso para ver los alumnos'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación */}
            {showModal && (
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
                            {grupoLleno ? 'Grupo lleno' : 'Confirmar cambio de grupo'}
                        </h3>
                        <p style={{
                            color: '#6c757d',
                            marginBottom: '20px',
                            fontSize: '1rem'
                        }}>
                            {grupoLleno 
                                ? 'Este grupo ya está lleno' 
                                : '¿Estás seguro de que quieres hacer el cambio de grupo?'
                            }
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={handleCancelarCambio}
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
                                No
                            </button>
                            <button
                                onClick={handleConfirmarCambio}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    backgroundColor: grupoLleno ? '#6c757d' : '#dc3545',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = grupoLleno ? '#5a6268' : '#c82333'}
                                onMouseOut={(e) => e.target.style.backgroundColor = grupoLleno ? '#6c757d' : '#dc3545'}
                            >
                                {grupoLleno ? 'Entendido' : 'Sí'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TablaGrupos; 