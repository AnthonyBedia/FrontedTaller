import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Fade,
  Grow,
} from "@mui/material";

const ConfirmarEliminacion = ({ onConfirm, onCancel }) => {
  return (
    <Fade in={true}>
      <Card
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 2,
          "&:hover": {
            boxShadow: 4,
            transition: "all 0.3s ease-in-out",
          },
        }}
      >
        <CardContent>
          <Grow in={true}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "error.main",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: 8 }}>⚠️</span>
                Confirmar Eliminación
              </Typography>
            </Box>
          </Grow>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "text.secondary",
            }}
          >
            ¿Está seguro que desea eliminar este componente? Esta acción no se
            puede deshacer.
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button variant="outlined" onClick={onCancel} sx={{ px: 3 }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onConfirm}
              sx={{ px: 3 }}
            >
              Eliminar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

ConfirmarEliminacion.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmarEliminacion;
