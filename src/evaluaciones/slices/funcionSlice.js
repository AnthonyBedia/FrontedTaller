import { createSlice } from '@reduxjs/toolkit'

export const funcionSlice = createSlice({
    name: "funcion",
    initialState: {
        status: '',
        funcionidActiva: null,
        funciones: [],
        estaCargandoFormulas: false,
    },
    reducers: {
        iniciaCargaFunciones: (state) => {
            state.estaCargandoFunciones = true;
        },
        cargaFunciones: ( state, action ) => {
            state.funciones = action.payload.funciones;
            state.estaCargandoFunciones = false;
        },
        cargaFuncionIdActiva: ( state, action ) => {
            state.funcionidActiva = action.payload.funcionidActivo;
        },
    }
});

export const { iniciaCargaFunciones, cargaFunciones, cargaFuncionIdActiva } = funcionSlice.actions;