import { createSlice } from '@reduxjs/toolkit'

export const formulaSlice = createSlice({
    name: "formula",
    initialState: {
        status: '',
        formulaidActiva: null,
        formulas: [],
        estaCargandoFormulas: false,
    },
    reducers: {
        iniciaCargaFormulas: (state) => {
            state.estaCargandoFormulas = true;
        },
        cargaFormulas: ( state, action ) => {
            state.formulas = action.payload.formulas;
            state.estaCargandoFormulas = false;
        },
        cargaFormulaIdActiva: ( state, action ) => {
            state.formulaidActiva = action.payload.formulaidActivo;
        },
    }
});

export const { iniciaCargaFormulas, cargaFormulas, cargaFormulaIdActiva } = formulaSlice.actions;