import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Fade,
  Grow,
  Stack,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

const FormularioComponente = ({
  nombre,
  peso,
  onChangeNombre,
  onChangePeso,
  onCancel,
  onSave,
  componentesDisponibles = [],
  loading = false,
  error = null,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };

  const handleChange = (event, newValue) => {
    if (newValue) {
      onChangeNombre(newValue.descripcion);
      onChangePeso(newValue.peso);
    }
  };

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
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: 8 }}>♦️</span>
                {nombre ? "Editar Componente" : "Nuevo Componente"}
              </Typography>
            </Box>
          </Grow>

          <Stack spacing={3}>
            <Autocomplete
              options={componentesDisponibles}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return option?.descripcion || "";
              }}
              filterOptions={(options, { inputValue }) => {
                const searchTerm = inputValue.toLowerCase().trim();
                if (!searchTerm) return options;
                return options.filter((option) =>
                  option?.descripcion?.toLowerCase().includes(searchTerm)
                );
              }}
              value={
                componentesDisponibles.find((c) => c.descripcion === nombre) ||
                null
              }
              onChange={handleChange}
              onInputChange={handleInputChange}
              inputValue={inputValue}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nombre del Componente"
                  placeholder="Buscar o seleccionar un componente"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              noOptionsText="No se encontraron componentes"
              loadingText="Cargando componentes..."
            />

            <TextField
              fullWidth
              label="Peso (%)"
              id="peso"
              type="number"
              value={peso}
              onChange={(e) => onChangePeso(e.target.value)}
              placeholder="Ingrese el peso del componente"
              variant="outlined"
              size="small"
              inputProps={{
                min: 0,
                max: 100,
              }}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={onCancel} sx={{ px: 3 }}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={onSave} sx={{ px: 3 }}>
                Guardar
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );
};

FormularioComponente.propTypes = {
  nombre: PropTypes.string.isRequired,
  peso: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChangeNombre: PropTypes.func.isRequired,
  onChangePeso: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  componentesDisponibles: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default FormularioComponente;
