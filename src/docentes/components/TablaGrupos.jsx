import React from 'react';

const TablaGrupos = ({ 
    alumnos, 
    gruposAlumnos, 
    gruposInfo, 
    grupoSeleccionado, 
    handleContextMenu 
}) => {
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
                                    cursor: 'context-menu'
                                }}
                                onContextMenu={(e) => handleContextMenu(e, 'alumno', {
                                    alumno: alumnosAMostrar[startIndex],
                                    grupoId: currentGroupId
                                })}
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
                                        cursor: 'context-menu'
                                    }}
                                    onContextMenu={(e) => handleContextMenu(e, 'alumno', {
                                        alumno: alumnosAMostrar[j],
                                        grupoId: currentGroupId
                                    })}
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
                                cursor: 'context-menu'
                            }}
                            onContextMenu={(e) => handleContextMenu(e, 'alumno', {
                                alumno: alumnosAMostrar[startIndex],
                                grupoId: currentGroupId
                            })}
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
                                    cursor: 'context-menu'
                                }}
                                onContextMenu={(e) => handleContextMenu(e, 'alumno', {
                                    alumno: alumnosAMostrar[j],
                                    grupoId: currentGroupId
                                })}
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
        <div style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px'
        }}>
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
    );
};

export default TablaGrupos; 