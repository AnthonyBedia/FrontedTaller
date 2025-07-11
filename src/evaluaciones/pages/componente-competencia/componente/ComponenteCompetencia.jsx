import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Divider,
  Fade,
  Grow,
} from "@mui/material";
import { componenteService } from "../../../services/componenteService";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ComponenteCompetencia = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarComponentes = async () => {
      try {
        await componenteService.getComponentes();
      } catch (error) {
        console.error("Error al cargar componentes:", error);
        setError(
          "Error al cargar los componentes. Por favor, intente más tarde."
        );
      }
    };
    cargarComponentes();
  }, []);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Fade in={true}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("../")}
              sx={{ mb: 2 }}
            >
              Ir a inicio
            </Button>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: "error.light",
                color: "error.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">{error}</Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{ ml: 2 }}
              >
                Reintentar
              </Button>
            </Paper>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true}>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("../")}
            sx={{ mb: 3 }}
          >
            Ir a inicio
          </Button>

          <Grow in={true}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                COMPONENTES Y COMPETENCIAS
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Box>
          </Grow>

          <Stack spacing={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Asociar Componentes a Competencias
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Aquí podrás asociar los componentes con sus respectivas
                competencias y asignarles un peso.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("asociar")}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                }}
              >
                Ir a Asociar
              </Button>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Gestionar Componentes
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Administra los componentes del sistema, crea nuevos o modifica
                los existentes.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("gestionar")}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                }}
              >
                Ir a Gestionar
              </Button>
            </Paper>
          </Stack>
        </Box>
      </Fade>
    </Container>
  );
};

export default ComponenteCompetencia;
