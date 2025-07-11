import React, { useEffect } from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Divider,
  Grid,
  Button
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getRubricas,
  seleccionarRubricaPorId,
} from "../../actions/evalThunks";
import "../../views/verRubricaStyles.css";

const VisualizadorRubrica = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { rubricas, rubricaSeleccionada } = useSelector((state) => state.rubrica);

  useEffect(() => {
    dispatch(getRubricas());
  }, [dispatch]);

  const handleChange = (_, rubrica) => {
    dispatch(seleccionarRubricaPorId(rubrica?.id));
  };

  return (
    <Box className="visualizador-container">
        <Button onClick={() => navigate("../")}>Ir a inicio</Button>
      <Typography variant="h5" className="titulo-principal">
        Visualizar Rúbricas
      </Typography>

      <Autocomplete
        options={rubricas}
        getOptionLabel={(option) => `${option.id} - ${option.nombre}`}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} label="Selecciona una Rúbrica" fullWidth />
        )}
        className="autocomplete-rubrica"
      />

      {rubricaSeleccionada && (
        <Card variant="outlined" className="rubrica-card">
          <CardContent>
            <Typography variant="h6" className="rubrica-nombre">
              {rubricaSeleccionada.nombre}
            </Typography>
            <Typography variant="body2" className="rubrica-descripcion">
              {rubricaSeleccionada.descripcion}
            </Typography>
            <Typography variant="body2" className="rubrica-estado">
                Estado:{" "}
                <span className={rubricaSeleccionada.estado === "ACTIVO" ? "estado-activo" : ""}>
                    {rubricaSeleccionada.estado}
                </span>
            </Typography>

            <Divider className="rubrica-divider" />

            <Typography variant="subtitle1">Componentes asociados:</Typography>
            <ul className="rubrica-componentes">
              {rubricaSeleccionada.componenteIds.map((cid) => (
                <li key={cid}>Componente ID: {cid}</li>
              ))}
            </ul>

            <Divider className="rubrica-divider" />

            <Typography variant="subtitle1">Criterios:</Typography>
            {rubricaSeleccionada.criterios.map((criterio) => (
              <Box key={criterio.id} className="criterio-box">
                <Typography variant="subtitle2">{criterio.descripcion}</Typography>
                <Typography variant="body2" className="rubrica-estado">
                    Estado:{" "}
                    <span className={rubricaSeleccionada.estado === "ACTIVO" ? "estado-activo" : ""}>
                        {rubricaSeleccionada.estado}
                    </span>
                </Typography>

                <Grid container spacing={2} className="nivel-grid">
                  {criterio.niveles.map((nivel) => (
                    <Grid item xs={12} md={6} key={nivel.id}>
                      <Card variant="outlined" className="nivel-card">
                        <Typography variant="body2">
                          <strong>{nivel.titulo}</strong> - {nivel.descripcion}
                        </Typography>
                        <Typography variant="caption">
                          Puntaje máximo: {nivel.puntajemax}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default VisualizadorRubrica;
