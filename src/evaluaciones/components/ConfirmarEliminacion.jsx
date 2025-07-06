import PropTypes from "prop-types";
import styles from "./ConfirmarEliminacion.module.css";

const ConfirmarEliminacion = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#d32f2f", fontSize: 18, marginRight: 6 }}>
          ⚠️
        </span>
        <span style={{ fontWeight: "bold", color: "#444" }}>
          Confirmar Eliminación
        </span>
      </div>
      <p className={styles.mensaje}>
        ¿Está seguro que desea eliminar este componente? Esta acción no se puede
        deshacer.
      </p>
      <div className={styles.botones}>
        <button className={styles.cancelar} onClick={onCancel}>
          Cancelar
        </button>
        <button className={styles.eliminar} onClick={onConfirm}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

ConfirmarEliminacion.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmarEliminacion;
