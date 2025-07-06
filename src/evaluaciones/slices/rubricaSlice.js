import { createSlice } from "@reduxjs/toolkit";

export const rubricaSlice = createSlice({
    name: "rubrica",
    initialState: {
        status: "idle",
        rubricaGuardada: null,
        error: null
    },
    reducers: {
        iniciaGuardadoRubrica: (state) => {
            state.status = "loading";
            state.error = null;
        },
        guardadoRubricaExitoso: (state, action) => {
            state.status = "succeeded";
            state.rubricaGuardada = action.payload;
        },
        guardadoRubricaError: (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        }
    }
});

export const {
    iniciaGuardadoRubrica,
    guardadoRubricaExitoso,
    guardadoRubricaError
} = rubricaSlice.actions;