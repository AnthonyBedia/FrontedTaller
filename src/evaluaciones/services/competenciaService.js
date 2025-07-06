export const competenciaService = {
  // Obtener todas las competencias
  getCompetencias: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/competencias", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  },

  // Obtener una competencia por ID
  getCompetenciaById: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/competencias/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    return data;
  },

  // Asociar competencia con componente
  asociarCompetencia: async (competenciaId, componenteId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:8080/api/competencias/asociar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          competenciaId,
          componenteId,
        }),
      }
    );
    const data = await response.json();
    return data;
  },

  // Desasociar competencia de componente
  desasociarCompetencia: async (competenciaId, componenteId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/competencias/asociar/${competenciaId}/${componenteId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data;
  },

  // Obtener competencias por componente
  getCompetenciasByComponente: async (componenteId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/componente-competencia-con-competencias/${componenteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        throw new Error("Error al obtener las competencias");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getCompetenciasByComponente:", error);
      throw error;
    }
  },
};
