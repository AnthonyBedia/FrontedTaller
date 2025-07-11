import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '../../seguridad/slices';
import { cursoSlice } from '../../cursos/slices';
import { docenteCursoSlice } from '../../docentes/slices/cursoSlice';
import {formulaSlice, funcionSlice, rubricaSlice, componenteSlice} from '../../evaluaciones/slices';
import { arbolSlice } from '../../evaluaciones/slices/treeDashboard';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    curso: cursoSlice.reducer,
    formula: formulaSlice.reducer,
    funcion: funcionSlice.reducer,
    rubrica: rubricaSlice.reducer,
    arbol: arbolSlice.reducer,
    componente: componenteSlice.reducer,
    docenteCurso: docenteCursoSlice.reducer,
  },
});
