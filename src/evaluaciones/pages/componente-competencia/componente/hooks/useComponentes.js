import { useState, useEffect } from "react";

const RECENT_COMPONENTS_KEY = "recentComponents";

export const useComponentes = () => {
  const [componentes, setComponentes] = useState([]);
  const [componentesDisponibles, setComponentesDisponibles] = useState([]);
  const [componentesRecientes, setComponentesRecientes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar componentes recientes del localStorage al iniciar
  useEffect(() => {
    const storedRecentComponents = localStorage.getItem(RECENT_COMPONENTS_KEY);
    if (storedRecentComponents) {
      setComponentesRecientes(JSON.parse(storedRecentComponents));
    }
  }, []);

  // Guardar componentes recientes en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(
      RECENT_COMPONENTS_KEY,
      JSON.stringify(componentesRecientes)
    );
  }, [componentesRecientes]);

  useEffect(() => {
    cargarComponentes();
  }, []);

  const cargarCompetenciasAsociadas = async (componenteId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/componente-competencia-con-competencias/${componenteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return [];
    } catch (error) {
      console.error("Error al cargar competencias asociadas:", error);
      return [];
    }
  };

  const cargarComponentes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener componentes con peso
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/componentes-con-peso",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al cargar los componentes");
      }
      const componentesData = await response.json();
      setComponentesDisponibles(componentesData);

      // Para cada componente, cargar sus competencias asociadas
      const componentesConCompetencias = await Promise.all(
        componentesData.map(async (componente) => {
          try {
            const competenciasResponse = await fetch(
              `http://localhost:8080/api/componente-competencia-con-competencias/${componente.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!competenciasResponse.ok) {
              console.error(
                `Error al cargar competencias para componente ${componente.id}`
              );
              return { ...componente, competencias: [] };
            }
            const competencias = await competenciasResponse.json();
            return { ...componente, competencias };
          } catch (error) {
            console.error(
              `Error al cargar competencias para componente ${componente.id}:`,
              error
            );
            return { ...componente, competencias: [] };
          }
        })
      );

      // Filtrar solo los componentes que tienen competencias asociadas
      const componentesFiltrados = componentesConCompetencias.filter(
        (comp) => comp.competencias && comp.competencias.length > 0
      );
      setComponentes(componentesFiltrados);
    } catch (error) {
      console.error("Error al cargar componentes:", error);
      setError("Error al cargar los componentes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData, editingComponente) => {
    try {
      if (editingComponente) {
        // Actualizar componente existente
        const componenteActualizado = {
          ...editingComponente,
          descripcion: formData.descripcion,
          peso: formData.peso,
        };

        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/componente/${editingComponente.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              descripcion: formData.descripcion,
              peso: Number(formData.peso) || 0,
              estado: editingComponente.estado || "A",
              evaluacionid: editingComponente.evaluacionid || 1,
              cursoid: editingComponente.cursoid || 1,
              orden: editingComponente.orden || 1,
              nivel: editingComponente.nivel || 1,
              codigo: editingComponente.codigo || "GEN",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el componente en el servidor");
        }

        // Si la actualización en el backend fue exitosa, actualizar el estado local
        setComponentes((prev) =>
          prev.map((c) =>
            String(c.id) === String(editingComponente.id)
              ? componenteActualizado
              : c
          )
        );

        // Actualizar en componentes recientes si existe
        setComponentesRecientes((prev) =>
          prev.map((c) =>
            String(c.id) === String(editingComponente.id)
              ? componenteActualizado
              : c
          )
        );

        return {
          success: true,
          message: "Componente actualizado exitosamente",
        };
      } else {
        // Crear nuevo componente
        let newId = formData.id;
        if (!newId) {
          if (window.crypto?.randomUUID) {
            newId = window.crypto.randomUUID();
          } else {
            newId = `${Date.now()}-${Math.random()}`;
          }
        }
        const nuevoComponente = {
          id: newId,
          descripcion: formData.descripcion,
          peso: formData.peso,
          competencias: [],
        };

        // Verificar si el componente ya existe
        const existe = componentes.some(
          (c) => String(c.id) === String(nuevoComponente.id)
        );
        if (!existe) {
          // Agregar nuevo componente solo si no existe
          setComponentes((prev) => [nuevoComponente, ...prev]);
          // Agregar a componentes recientes solo si no existe
          setComponentesRecientes((prev) => {
            const existeEnRecientes = prev.some(
              (c) => String(c.id) === String(nuevoComponente.id)
            );
            if (!existeEnRecientes) {
              return [nuevoComponente, ...prev];
            }
            return prev;
          });
        }
        // Después de guardar, recarga la lista desde el backend
        await cargarComponentes();
        return {
          success: true,
          message: "Componente agregado exitosamente",
        };
      }
    } catch (error) {
      console.error("Error en handleSave:", error);
      return {
        success: false,
        message: "Error al procesar la operación",
      };
    }
  };

  const handleDelete = async (idComponente) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/componente-competencia/by-componente/${idComponente}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        // Eliminar de componentes y componentes recientes
        setComponentes((prev) =>
          prev.filter((c) => String(c.id) !== String(idComponente))
        );
        setComponentesDisponibles((prev) =>
          prev.filter((c) => String(c.id) !== String(idComponente))
        );
        setComponentesRecientes((prev) =>
          prev.filter((c) => String(c.id) !== String(idComponente))
        );
        return {
          success: true,
          message: "Componente y asociaciones eliminados exitosamente",
        };
      } else {
        return {
          success: false,
          message: "Error al eliminar el componente en el servidor.",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error de red al intentar eliminar el componente.",
      };
    }
  };

  const handleGuardarCambios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/componente-competencia/guardar-cambios",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(componentes),
        }
      );
      if (response.ok) {
        // Limpiar componentes recientes después de guardar exitosamente
        setComponentesRecientes([]);
        // Recargar componentes para obtener las competencias actualizadas
        await cargarComponentes();
        return {
          success: true,
          message: "Cambios guardados exitosamente",
        };
      } else {
        return {
          success: false,
          message: "Error al guardar los cambios en el servidor.",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error al guardar los cambios. Por favor, intente nuevamente.",
      };
    }
  };

  const actualizarComponente = (id, nuevoComponente) => {
    setComponentes((prev) =>
      prev.map((c) =>
        String(c.id) === String(id) ? { ...c, ...nuevoComponente } : c
      )
    );
  };

  return {
    componentes,
    setComponentes,
    componentesDisponibles,
    componentesRecientes,
    error,
    isLoading,
    cargarComponentes,
    handleDelete,
    handleSave,
    handleGuardarCambios,
    actualizarComponente,
  };
};
