import PropTypes from "prop-types";
import styles from "./OpcionesEdicion.module.css";

const OpcionesEdicion = ({ onSelect }) => (
  <div className={styles.container}>
    <h3>Opción a editar:</h3>
    <div className={styles.buttonGroup}>
      <button onClick={() => onSelect("componente")}>Componente</button>
      <button onClick={() => onSelect("competencia")}>Competencia</button>
    </div>
  </div>
);

OpcionesEdicion.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default OpcionesEdicion;
