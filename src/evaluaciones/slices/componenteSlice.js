
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  componentes: [],
};

export const componenteSlice = createSlice({
  name: "componente",
  initialState: {
      status: "idle",
      componenteActualizado: null,
      error: null
  },
  reducers: {
    iniciaCargaComponentes: (state) => {
      state.isLoading = true;
    },
    cargaComponentes: (state, action) => {
      state.componentes = action.payload.componentes;
      state.isLoading = false;
    },
    iniciaActualizacionComponente: (state) => {
        state.status = "loading";
        state.error = null;
    },
    actualizacionComponenteExitosa: (state, action) => {
        state.status = "succeeded";
        state.componenteActualizado = action.payload;
    },
    actualizacionComponenteError: (state, action) => {
        state.status = "failed";
        state.error = action.payload;
    }
  },
});

export const {
    iniciaCargaComponentes,
    cargaComponentes,
    iniciaActualizacionComponente,
    actualizacionComponenteExitosa,
    actualizacionComponenteError
} = componenteSlice.actions;

export default componenteSlice.reducer;
