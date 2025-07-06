import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  Fade,
  Grow,
  Zoom,
  Stack,
  Divider,
  Alert,
  Snackbar,
  Paper,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { ComponenteCompetenciaCard } from "../components/ComponenteCompetenciaCard";
import { EditarComponenteDialog } from "../components/dialogs/EditarComponenteDialog";
import { CompetenciasDialog } from "../components/dialogs/CompetenciasDialog";
import { useComponentes } from "../hooks/useComponentes";
import { useCompetencias } from "../hooks/useCompetencias";
import { ComponenteCompetenciaCardSingle } from "../components/cards/ComponenteCompetenciaCardSingle";

const AsociarComponentes = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingComponente, setEditingComponente] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    peso: "",
    id: "",
  });
  const [openCompetenciasDialog, setOpenCompetenciasDialog] = useState(false);
  const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    componentes,
    error,
    componentesDisponibles,
    handleDelete,
    handleSave,
    handleGuardarCambios,
    setComponentes,
    cargarComponentes,
  } = useComponentes();

  const {
    competenciasDisponibles,
    competenciasSeleccionadas,
    cargarCompetencias,
    handleToggleCompetencia,
    setCompetenciasIniciales,
    resetCompetencias,
  } = useCompetencias();

  const handleOpenDialog = async (componente = null) => {
    try {
      // Asegurarse de que los componentes estén cargados
      if (componentesDisponibles.length === 0) {
        const result = await cargarComponentes();
        if (!result.success) {
          setSnackbar({
            open: true,
            message: "Error al cargar los componentes disponibles",
            severity: "error",
          });
          return;
        }
      }

      if (componente) {
        setEditingComponente(componente);
        setFormData({
          id: componente.idComponente || componente.id,
          descripcion: componente.descripcion,
          peso: componente.peso,
        });
      } else {
        setEditingComponente(null);
        setFormData({
          id: "",
          descripcion: "",
          peso: "",
        });
      }
      setOpenDialog(true);
    } catch (error) {
      console.error("Error al abrir el diálogo:", error);
      setSnackbar({
        open: true,
        message: "Error al abrir el diálogo de edición",
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingComponente(null);
    setFormData({
      descripcion: "",
      peso: "",
      id: "",
    });
  };

  const handleSaveComponente = async () => {
    const result = await handleSave(formData, editingComponente);
    if (result.success) {
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: result.message,
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: result.message,
        severity: "error",
      });
    }
  };

  const handleDeleteComponente = async (nombreComponente) => {
    if (window.confirm("¿Está seguro de eliminar este componente?")) {
      const result = await handleDelete(nombreComponente);
      setSnackbar({
        open: true,
        message: result.message,
        severity: result.success ? "success" : "error",
      });
    }
  };

  const handleOpenCompetenciasDialog = async (componente) => {
    setComponenteSeleccionado(componente);
    setCompetenciasIniciales(componente.competencias);
    const result = await cargarCompetencias();
    if (result.success) {
      setOpenCompetenciasDialog(true);
    } else {
      setSnackbar({
        open: true,
        message: result.message,
        severity: "error",
      });
    }
  };

  const handleCloseCompetenciasDialog = () => {
    setOpenCompetenciasDialog(false);
    setComponenteSeleccionado(null);
    resetCompetencias();
  };

  const handleGuardarCompetencias = () => {
    setComponentes((prev) =>
      prev.map((c) =>
        c.idComponente === componenteSeleccionado.idComponente
          ? { ...c, competencias: competenciasSeleccionadas }
          : c
      )
    );
    handleCloseCompetenciasDialog();
  };

  const handleGuardarTodosLosCambios = async () => {
    const result = await handleGuardarCambios();
    setSnackbar({
      open: true,
      message: result.message,
      severity: result.success ? "success" : "error",
    });
  };

  const componentesUnicos = componentesDisponibles.filter(
    (comp, index, self) =>
      index === self.findIndex((c) => c.descripcion === comp.descripcion)
  );

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
                ASOCIAR COMPONENTES A COMPETENCIAS
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Box>
          </Grow>

          <Zoom in={true}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {componentes.map((componente) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={componente.idComponente || componente.id}
                >
                  <ComponenteCompetenciaCardSingle
                    componente={componente}
                    onEdit={handleOpenDialog}
                    onDelete={handleDeleteComponente}
                    onAddCompetencias={handleOpenCompetenciasDialog}
                  />
                </Grid>
              ))}
            </Grid>
          </Zoom>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              Agregar Componente
            </Button>

            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              size="large"
              onClick={handleGuardarTodosLosCambios}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              Guardar
            </Button>
          </Stack>

          <EditarComponenteDialog
            open={openDialog}
            onClose={handleCloseDialog}
            formData={formData}
            setFormData={setFormData}
            componentesUnicos={componentesUnicos}
            onSave={handleSaveComponente}
            editingComponente={editingComponente}
          />

          <CompetenciasDialog
            open={openCompetenciasDialog}
            onClose={handleCloseCompetenciasDialog}
            competenciasDisponibles={competenciasDisponibles}
            competenciasSeleccionadas={competenciasSeleccionadas}
            onToggleCompetencia={handleToggleCompetencia}
            onGuardar={handleGuardarCompetencias}
          />

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
};

export default AsociarComponentes;
