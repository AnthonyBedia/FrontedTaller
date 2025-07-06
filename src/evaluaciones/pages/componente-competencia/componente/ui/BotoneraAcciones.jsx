import { Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";

const BotoneraAcciones = ({ onAgregar, onGuardar }) => (
  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onAgregar}
      sx={{
        px: 3,
        py: 1.5,
        borderRadius: 2,
        boxShadow: 2,
        background: "#0d6efd",
        color: "#fff",
        "&:hover": {
          boxShadow: 4,
          background: "#0b5ed7",
          color: "#fff",
        },
      }}
    >
      Agregar Componente
    </Button>
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      size="large"
      onClick={onGuardar}
      sx={{
        px: 4,
        py: 1.5,
        borderRadius: 2,
        boxShadow: 2,
        background: "#198174",
        color: "#fff",
        "&:hover": {
          boxShadow: 4,
          background: "#14695e",
          color: "#fff",
        },
      }}
    >
      Guardar
    </Button>
  </Stack>
);

BotoneraAcciones.propTypes = {
  onAgregar: PropTypes.func.isRequired,
  onGuardar: PropTypes.func.isRequired,
};

export default BotoneraAcciones;
