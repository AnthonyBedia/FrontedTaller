import React, { useState } from 'react'
import { CursosLayout } from '../layout';
import { CursosResumen, CursosCopiar, CursosNuevo } from '../views';
import { useNavigate } from 'react-router-dom';

export const CursosHome = ( {vista} ) => {
    const navigate= useNavigate()
    let contenido;

    if (vista === 'resumen') {
        contenido = <CursosResumen />;
    } else if (vista === 'copiar') {
        contenido = <CursosCopiar />;
    } else if (vista === 'nuevo') {
        contenido = <CursosNuevo />;
    } else {
        contenido = <br></br>;
    }

    return (
        <main>
            <button onClick={()=> navigate("/evaluaciones/")}>Ir a evaluaciones</button>
            <CursosLayout>
                { contenido }
            </CursosLayout>
        </main>
    )
}
