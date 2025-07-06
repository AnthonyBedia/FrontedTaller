import PropTypes from "prop-types";
import styles from "./FormularioComponente.module.css";

const FormularioComponente = ({
  nombre,
  peso,
  onChangeNombre,
  onChangePeso,
  onCancel,
  onSave,
}) => {
  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#1a237e", fontSize: 18, marginRight: 6 }}>
          ♦️
        </span>
        <span style={{ fontWeight: "bold", color: "#444" }}>
          {nombre ? "Editar Componente" : "Nuevo Componente"}
        </span>
      </div>
      <div className={styles.form}>
        <div className={styles.campo}>
          <label htmlFor="nombre">Nombre del Componente:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => onChangeNombre(e.target.value)}
            placeholder="Ingrese el nombre del componente"
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor="peso">Peso (%):</label>
          <input
            type="number"
            id="peso"
            value={peso}
            onChange={(e) => onChangePeso(e.target.value)}
            placeholder="Ingrese el peso del componente"
            min="0"
            max="100"
          />
        </div>
        <div className={styles.botones}>
          <button className={styles.cancelar} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.guardar} onClick={onSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

FormularioComponente.propTypes = {
  nombre: PropTypes.string.isRequired,
  peso: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChangeNombre: PropTypes.func.isRequired,
  onChangePeso: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default FormularioComponente;
