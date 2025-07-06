import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { competenciaService } from "../services/competenciaService";
import { componenteService } from "../services/componenteService";

export const CompetenciasPage = () => {
  const dispatch = useDispatch();
  const [componentesDisponibles, setComponentesDisponibles] = useState([]);
  const [componenteSeleccionado, setComponenteSeleccionado] = useState("");
  const [competenciasAsociadas, setCompetenciasAsociadas] = useState([]);
  const [todasCompetencias, setTodasCompetencias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarComponentesDisponibles();
    cargarTodasCompetencias();
  }, []);

  useEffect(() => {
    if (componenteSeleccionado) {
      cargarCompetenciasAsociadas(componenteSeleccionado);
    } else {
      setCompetenciasAsociadas([]);
    }
  }, [componenteSeleccionado]);

  const cargarComponentesDisponibles = async () => {
    const data = await componenteService.getCursocomponentes();
    setComponentesDisponibles(data);
  };

  const cargarTodasCompetencias = async () => {
    setLoading(true);
    const data = await competenciaService.getCompetencias();
    setTodasCompetencias(data);
    setLoading(false);
  };

  const cargarCompetenciasAsociadas = async (componenteId) => {
    setLoading(true);
    const data =
      await competenciaService.getCompetenciasByComponente(componenteId);
    setCompetenciasAsociadas(data);
    setLoading(false);
  };

  const handleAsociar = async (competenciaId) => {
    await competenciaService.asociarCompetencia(
      competenciaId,
      componenteSeleccionado
    );
    cargarCompetenciasAsociadas(componenteSeleccionado);
  };

  const handleDesasociar = async (competenciaId) => {
    await competenciaService.desasociarCompetencia(
      competenciaId,
      componenteSeleccionado
    );
    cargarCompetenciasAsociadas(componenteSeleccionado);
  };

  // Competencias NO asociadas
  const competenciasNoAsociadas = todasCompetencias.filter(
    (c) => !competenciasAsociadas.some((a) => a.id === c.id)
  );

  const nombreComponente =
    componentesDisponibles.find(
      (c) => String(c.id) === String(componenteSeleccionado)
    )?.descripcion || "";

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Competencias asociadas a componente
      </Typography>

      <Box mb={2}>
        <Typography variant="subtitle1" gutterBottom>
          Seleccione un componente:
        </Typography>
        <Select
          id="componenteSelect"
          value={componenteSeleccionado}
          onChange={(e) => setComponenteSeleccionado(e.target.value)}
          displayEmpty
          sx={{ minWidth: 300 }}
        >
          <MenuItem value="">-- Seleccione --</MenuItem>
          {componentesDisponibles.map((comp) => (
            <MenuItem key={comp.id} value={comp.id}>
              {comp.descripcion}
            </MenuItem>
          ))}
        </Select>
        {nombreComponente && (
          <Typography variant="subtitle2" color="primary" mt={1}>
            Componente seleccionado: <b>{nombreComponente}</b>
          </Typography>
        )}
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Competencias asociadas:
          </Typography>
          <List>
            {competenciasAsociadas.map((competencia) => (
              <ListItem
                key={competencia.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="desasociar"
                    onClick={() => handleDesasociar(competencia.id)}
                  >
                    <RemoveIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={competencia.nombre}
                  secondary={competencia.descripcion}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom>
            Agregar competencia:
          </Typography>
          <List>
            {competenciasNoAsociadas.map((competencia) => (
              <ListItem
                key={competencia.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="asociar"
                    onClick={() => handleAsociar(competencia.id)}
                  >
                    <AddIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={competencia.nombre}
                  secondary={competencia.descripcion}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};
