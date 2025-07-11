import { useState } from "react";

export const useCompetencias = () => {
  const [competenciasDisponibles, setCompetenciasDisponibles] = useState([]);
  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState(
    []
  );

  const cargarCompetencias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/competencias", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCompetenciasDisponibles(data);
      return {
        success: true,
        message: "Competencias cargadas exitosamente",
      };
    } catch (error) {
      console.error("Error al cargar competencias:", error);
      return {
        success: false,
        message:
          "Error al cargar las competencias. Por favor, intente nuevamente.",
      };
    }
  };

  const handleToggleCompetencia = (competencia) => {
    setCompetenciasSeleccionadas((prev) => {
      const isSelected = prev.some((c) => c.id === competencia.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== competencia.id);
      } else {
        return [...prev, competencia];
      }
    });
  };

  const setCompetenciasIniciales = (competencias) => {
    setCompetenciasSeleccionadas(competencias || []);
  };

  const resetCompetencias = () => {
    setCompetenciasSeleccionadas([]);
  };

  return {
    competenciasDisponibles,
    competenciasSeleccionadas,
    cargarCompetencias,
    handleToggleCompetencia,
    setCompetenciasIniciales,
    resetCompetencias,
  };
};
