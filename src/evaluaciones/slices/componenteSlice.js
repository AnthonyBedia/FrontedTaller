
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  componentes: [],
};

export const componenteSlice = createSlice({
  name: "componente",
  initialState,
  reducers: {
    iniciaCargaComponentes: (state) => {
      state.isLoading = true;
    },
    cargaComponentes: (state, action) => {
      state.componentes = action.payload.componentes;
      state.isLoading = false;
    },
  },
});

export const { iniciaCargaComponentes, cargaComponentes } = componenteSlice.actions;
export default componenteSlice.reducer;
