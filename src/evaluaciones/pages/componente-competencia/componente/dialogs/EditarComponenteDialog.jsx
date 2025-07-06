import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Zoom } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect } from "react";

export const EditarComponenteDialog = ({
  open,
  onClose,
  formData,
  setFormData,
  onSave,
  editingComponente,
  isLoading,
}) => {
  useEffect(() => {
    if (editingComponente) {
      setFormData({
        id: editingComponente.id,
        descripcion: editingComponente.descripcion,
        peso: editingComponente.peso,
      });
    }
  }, [editingComponente, setFormData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Zoom}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6">
          {editingComponente ? "Editar componente" : "Agregar componente"}
        </Typography>
      </Box>
      <DialogContent sx={{ p: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 100,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nombre del componente"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              variant="outlined"
              placeholder="Ingrese el nombre del componente"
            />

            <TextField
              fullWidth
              label="Peso del componente"
              name="peso"
              type="number"
              value={formData.peso}
              onChange={handleChange}
              variant="outlined"
              placeholder="Ingrese el peso del componente"
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ borderRadius: 2 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={onSave}
                sx={{ borderRadius: 2 }}
              >
                Guardar
              </Button>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

EditarComponenteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    descripcion: PropTypes.string,
    peso: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editingComponente: PropTypes.object,
  isLoading: PropTypes.bool,
};
