import { createSlice } from '@reduxjs/toolkit'

export const arbolSlice = createSlice({
    name: "arbol",
    initialState: {
        status: '',
        arbolidActiva: null,
        arbole: [],
        estaCargandoArbol: false,
    },
    reducers: {
        iniciaCargaArbol: (state) => {
            state.estaCargandoArbol = true;
        },
        cargaArbol: ( state, action ) => {
            state.arbole = action.payload.arboles;
            state.estaCargandoArbol = false;
        },
        cargaArbolIdActiva: ( state, action ) => {
            state.arbolidActiva = action.payload.arbolidActivo;
        },
    }
});

export const { iniciaCargaArbol, cargaArbol, cargaArbolIdActiva } = arbolSlice.actions;