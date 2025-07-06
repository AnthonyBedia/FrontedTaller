import PropTypes from "prop-types";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Fade,
  Grow,
} from "@mui/material";

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
                  color: "primary.main",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: 8 }}>♦️</span>
                Checklist - Competencia
              </Typography>
            </Box>
          </Grow>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Asociar competencias
          </Typography>

          <Stack spacing={1} sx={{ mb: 3 }}>
            {competencias.map((comp) => (
              <FormControlLabel
                key={comp}
                control={
                  <Checkbox
                    checked={seleccionadas.includes(comp)}
                    onChange={() => onToggle(comp)}
                  />
                }
                label={comp}
              />
            ))}
          </Stack>

          {agregando ? (
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                value={nuevaCompetencia}
                onChange={(e) => setNuevaCompetencia(e.target.value)}
                placeholder="Nueva competencia"
              />
              <Button variant="contained" onClick={handleAdd} sx={{ px: 3 }}>
                Agregar
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setAgregando(false);
                  setNuevaCompetencia("");
                }}
                sx={{ px: 3 }}
              >
                Cancelar
              </Button>
            </Stack>
          ) : (
            <Button
              variant="outlined"
              onClick={() => setAgregando(true)}
              sx={{ mb: 3 }}
            >
              + Agregar competencia
            </Button>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={onSave}>
              Guardar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
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
