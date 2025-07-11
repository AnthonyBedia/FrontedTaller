import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cursoSeleccionado: null,
    busqueda: ''
};

export const docenteCursoSlice = createSlice({
    name: 'docenteCurso',
    initialState,
    reducers: {
        setCursoSeleccionado: (state, action) => {
            state.cursoSeleccionado = action.payload;
        },
        setBusqueda: (state, action) => {
            state.busqueda = action.payload;
        },
        clearCursoSeleccionado: (state) => {
            state.cursoSeleccionado = null;
            state.busqueda = '';
        }
    }
});

export const { setCursoSeleccionado, setBusqueda, clearCursoSeleccionado } = docenteCursoSlice.actions;

export default docenteCursoSlice.reducer; 