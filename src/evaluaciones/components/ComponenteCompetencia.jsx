import React, { useEffect, useState } from "react";
import styles from "./ComponenteCompetencia.module.css";

function ComponenteCompetencia() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComponentes = async () => {
      try {
        const response = await fetch("/api/componente-competencia");
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
        setComponentes(data);
      } catch (error) {
        console.error("Error al cargar los componentes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComponentes();
  }, []);

  if (loading)
    return <div className={styles.loading}>Cargando componentes...</div>;
  if (error)
    return (
      <div className={styles.error}>
        Error al cargar los componentes: {error}
      </div>
    );

  return (
    <div className={styles.container}>
      <h2>Componentes y Competencias</h2>
      {componentes.length === 0 ? (
        <p>No hay componentes asociados</p>
      ) : (
        <ul className={styles.lista}>
          {componentes.map((comp) => (
            <li key={comp.id} className={styles.item}>
              <div className={styles.componenteInfo}>
                <span className={styles.nombre}>
                  Componente: {comp.nombreComponente}
                </span>
                <span className={styles.peso}>Peso: {comp.peso}</span>
              </div>
              <div className={styles.competencias}>
                <h4>Competencias Asociadas:</h4>
                {comp.competenciasAsociadas ? (
                  <ul>
                    {comp.competenciasAsociadas.map((competencia, index) => (
                      <li key={index}>{competencia}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay competencias asociadas</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComponenteCompetencia;
