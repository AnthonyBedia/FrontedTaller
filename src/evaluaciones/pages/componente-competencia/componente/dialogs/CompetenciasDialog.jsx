import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { Zoom } from "@mui/material";
import PropTypes from "prop-types";
import { Autocomplete, TextField, Chip } from "@mui/material";

export const CompetenciasDialog = ({
  open,
  onClose,
  competenciasDisponibles,
  competenciasSeleccionadas,
  onToggleCompetencia,
  onGuardar,
}) => {
  // Para mantener la lógica, usamos onToggleCompetencia al seleccionar/deseleccionar en el Autocomplete
  const handleAutocompleteChange = (event, values) => {
    // Selecciona las que no estaban antes
    competenciasDisponibles.forEach((comp) => {
      const estaba = competenciasSeleccionadas.some((c) => c.id === comp.id);
      const ahora = values.some((c) => c.id === comp.id);
      if (!estaba && ahora) onToggleCompetencia(comp);
      if (estaba && !ahora) onToggleCompetencia(comp);
    });
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
          Seleccionar competencias para el componente
        </Typography>
      </Box>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Autocomplete
            multiple
            options={competenciasDisponibles}
            getOptionLabel={(option) => option.nombre}
            filterOptions={(options, { inputValue }) => {
              if (inputValue.length < 1) return [];
              return options.filter((option) =>
                option.nombre.toLowerCase().includes(inputValue.toLowerCase())
              );
            }}
            value={competenciasSeleccionadas}
            onChange={handleAutocompleteChange}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar y seleccionar competencias"
                placeholder="Escribe al menos 1 letra..."
                helperText="Puedes buscar y seleccionar varias competencias"
              />
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  label={option.nombre}
                  {...getTagProps({ index })}
                  key={`${option.id}-${index}-${option.nombre}`}
                />
              ))
            }
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 2 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={onGuardar}
              sx={{ borderRadius: 2 }}
            >
              Guardar
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

CompetenciasDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  competenciasDisponibles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  competenciasSeleccionadas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  onToggleCompetencia: PropTypes.func.isRequired,
  onGuardar: PropTypes.func.isRequired,
};
