import { createSlice } from "@reduxjs/toolkit";
import { competenciaService } from "../services/competenciaService";

const initialState = {
  competencias: [],
  competenciaSeleccionada: null,
  isLoading: false,
  error: null,
};

export const competenciaSlice = createSlice({
  name: "competencia",
  initialState,
  reducers: {
    setCompetencias: (state, action) => {
      state.competencias = action.payload;
    },
    setCompetenciaSeleccionada: (state, action) => {
      state.competenciaSeleccionada = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCompetencias,
  setCompetenciaSeleccionada,
  setLoading,
  setError,
} = competenciaSlice.actions;

// Thunks
export const fetchCompetencias = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const competencias = await competenciaService.getCompetencias();
    dispatch(setCompetencias(competencias));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const asociarCompetencia =
  (competenciaId, componenteId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await competenciaService.asociarCompetencia(competenciaId, componenteId);
      // Recargar las competencias después de asociar
      await dispatch(fetchCompetencias());
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const desasociarCompetencia =
  (competenciaId, componenteId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await competenciaService.desasociarCompetencia(
        competenciaId,
        componenteId
      );
      // Recargar las competencias después de desasociar
      await dispatch(fetchCompetencias());
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export default competenciaSlice.reducer;
