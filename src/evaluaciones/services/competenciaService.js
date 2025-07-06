import { evaluacionesApi } from "../../api/evaluacionesApi";

export const competenciaService = {
  // Obtener todas las competencias
  getCompetencias: async () => {
    const { data } = await evaluacionesApi.get("/competencias");
    return data;
  },

  // Obtener una competencia por ID
  getCompetenciaById: async (id) => {
    const { data } = await evaluacionesApi.get(`/competencias/${id}`);
    return data;
  },

  // Asociar competencia con componente
  asociarCompetencia: async (competenciaId, componenteId) => {
    const { data } = await evaluacionesApi.post("/competencias/asociar", {
      competenciaId,
      componenteId,
    });
    return data;
  },

  // Desasociar competencia de componente
  desasociarCompetencia: async (competenciaId, componenteId) => {
    const { data } = await evaluacionesApi.delete(
      `/competencias/asociar/${competenciaId}/${componenteId}`
    );
    return data;
  },
};
