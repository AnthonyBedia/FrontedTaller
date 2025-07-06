import PropTypes from "prop-types";
import styles from "./ChecklistCompetencias.module.css";
import { useState } from "react";

const ChecklistCompetencias = ({
  competencias,
  seleccionadas,
  onToggle,
  onCancel,
  onSave,
  onAddCompetencia,
}) => {
  const [agregando, setAgregando] = useState(false);
  const [nuevaCompetencia, setNuevaCompetencia] = useState("");

  const handleAdd = () => {
    if (nuevaCompetencia.trim()) {
      onAddCompetencia(nuevaCompetencia.trim());
      setNuevaCompetencia("");
      setAgregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#1a237e", fontSize: 18, marginRight: 6 }}>
          ♦️
        </span>
        <span style={{ fontWeight: "bold", color: "#444" }}>
          Checklist - Competencia
        </span>
      </div>
      <h4>Asociar competencias</h4>
      <ul className={styles.lista}>
        {competencias.map((comp) => (
          <li key={comp}>
            <label>
              <input
                type="checkbox"
                checked={seleccionadas.includes(comp)}
                onChange={() => onToggle(comp)}
              />
              {comp}
            </label>
          </li>
        ))}
      </ul>
      {agregando ? (
        <div
          style={{ display: "flex", gap: 8, width: "100%", marginBottom: 12 }}
        >
          <input
            type="text"
            value={nuevaCompetencia}
            onChange={(e) => setNuevaCompetencia(e.target.value)}
            placeholder="Nueva competencia"
            style={{
              flex: 1,
              borderRadius: 6,
              border: "1px solid #bbb",
              padding: "6px 10px",
            }}
          />
          <button
            className={styles.guardar}
            style={{ padding: "6px 14px", fontSize: 15 }}
            onClick={handleAdd}
          >
            Agregar
          </button>
          <button
            className={styles.cancelar}
            style={{ padding: "6px 14px", fontSize: 15 }}
            onClick={() => {
              setAgregando(false);
              setNuevaCompetencia("");
            }}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          style={{
            background: "#fff",
            color: "#000",
            border: "1px solid #1a237e",
            borderRadius: 8,
            padding: "6px 18px",
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: 14,
            marginTop: 2,
          }}
          onClick={() => setAgregando(true)}
        >
          + Agregar competencia
        </button>
      )}
      <div className={styles.buttonGroup}>
        <button className={styles.cancelar} onClick={onCancel}>
          Cancelar
        </button>
        <button className={styles.guardar} onClick={onSave}>
          Guardar
        </button>
      </div>
    </div>
  );
};

ChecklistCompetencias.propTypes = {
  competencias: PropTypes.arrayOf(PropTypes.string).isRequired,
  seleccionadas: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onAddCompetencia: PropTypes.func.isRequired,
};

export default ChecklistCompetencias;
