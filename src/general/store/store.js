import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '../../seguridad/slices';
import { cursoSlice } from '../../cursos/slices';
import {formulaSlice, funcionSlice} from '../../evaluaciones/slices';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    curso: cursoSlice.reducer,
    formula: formulaSlice.reducer,
    funcion: funcionSlice.reducer,
  },
});
