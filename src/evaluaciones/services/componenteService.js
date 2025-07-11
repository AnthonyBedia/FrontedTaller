export const componenteService = {
  // Obtener todos los componentes con sus competencias
  getComponentes: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:8080/api/componente-competencia-con-competencias",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data;
  },

  // Obtener un componente por ID
  getComponenteById: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/componente-competencia/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data;
  },

  // Crear un nuevo componente
  createComponente: async (componente) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/componente-competencia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            componenteId: componente.componenteId,
            competenciaId: componente.competenciaId,
            peso: componente.peso,
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en createComponente:", error);
      throw error;
    }
  },

  // Actualizar un componente existente
  updateComponente: async (id, componente) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/componente-competencia/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(componente),
      }
    );
    const data = await response.json();
    return data;
  },

  // Eliminar un componente
  deleteComponente: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/componente-competencia/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data;
  },

  // Obtener todos los detalles de componentes y competencias
  getComponentesDetalle: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:8080/api/componente-competencia-detalle",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data;
  },

  // Obtener componentes agrupados con competencias asociadas
  getComponentesConCompetencias: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:8080/api/componente-competencia-con-competencias",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data;
  },

  // Obtener todos los componentes con peso asignado
  getComponentesConPeso: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/componentes-con-peso",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getComponentesConPeso:", error);
      throw error;
    }
  },

  // Obtener todas las competencias
  getCompetencias: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/api/competencias", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  },

  // Eliminar un componente por nombre
  deleteComponenteByNombre: async (nombreComponente) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/componente-competencia/by-componente/${encodeURIComponent(nombreComponente)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en deleteComponenteByNombre:", error);
      throw error;
    }
  },

  // Crear un nuevo componente base
  crearComponenteBase: async (componente) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/componentes-con-peso",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            descripcion: componente.descripcion,
            peso: parseFloat(componente.peso),
          }),
        }
      );

      const data = await response.json();
      if (!data) {
        throw new Error("No se recibió respuesta del servidor");
      }

      return data;
    } catch (error) {
      console.error("Error en crearComponenteBase:", error);
      throw error;
    }
  },

  // Obtener componentes únicos con id, descripcion y peso
  getComponentesUnicos: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/componentes-unicos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getComponentesUnicos:", error);
      throw error;
    }
  },
};
