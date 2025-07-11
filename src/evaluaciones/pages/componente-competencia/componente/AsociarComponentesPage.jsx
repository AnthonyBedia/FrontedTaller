import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  Fade,
  Grow,
  Zoom,
  Divider,
  Alert,
  Snackbar,
  Grid,
  Autocomplete,
  TextField,
  CircularProgress,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { ComponenteCompetenciaCard } from "./ComponenteCompetenciaCard";
import { CompetenciasDialog } from "./dialogs/CompetenciasDialog";
import { useComponentes } from "./hooks/useComponentes";
import { useCompetencias } from "./hooks/useCompetencias";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import AddIcon from "@mui/icons-material/Add";

const AsociarComponentesPage = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingComponente, setEditingComponente] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    peso: "",
    id: "",
    codigo: "GEN",
  });
  const [openCompetenciasDialog, setOpenCompetenciasDialog] = useState(false);
  const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [componenteAEliminar, setComponenteAEliminar] = useState(null);

  const {
    componentes,
    componentesDisponibles,
    handleDelete,
    isLoading,
    cargarComponentes,
    setComponentes,
  } = useComponentes();

  const {
    competenciasDisponibles,
    competenciasSeleccionadas,
    cargarCompetencias,
    handleToggleCompetencia,
    setCompetenciasIniciales,
    resetCompetencias,
  } = useCompetencias();

  const handleOpenDialog = (componente = null) => {
    if (componente) {
      setEditingComponente(componente);
      setFormData({
        id: componente.idComponente || componente.id,
        descripcion: componente.descripcion,
        peso: componente.peso,
        codigo: componente.codigo || "GEN",
      });
    } else {
      setEditingComponente(null);
      setFormData({
        id: "",
        descripcion: "",
        peso: "",
        codigo: "GEN",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingComponente(null);
    setFormData({
      descripcion: "",
      peso: "",
      id: "",
      codigo: "GEN",
    });
  };

  const handleSaveComponente = async () => {
    if (editingComponente) {
      // Solo actualizar el nombre (descripción) localmente, sin tocar la base de datos
      setComponentes((prev) =>
        prev.map((c) =>
          String(c.id) === String(editingComponente.id)
            ? { ...c, descripcion: formData.descripcion }
            : c
        )
      );
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Nombre del componente actualizado.",
        severity: "success",
      });
      return;
    }
    // Si no estamos editando, crear uno nuevo (funcionalidad de agregar componente)
    let idUnico = formData.id;
    if (!idUnico || componentes.some((c) => String(c.id) === String(idUnico))) {
      // Genera un id único que no exista en el array
      do {
        idUnico = window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      } while (componentes.some((c) => String(c.id) === String(idUnico)));
    }
    let data = {};
    try {
      const response = await fetch("http://localhost:8080/componentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: formData.descripcion,
          peso: Number(formData.peso) || 0,
          estado: formData.estado || "A",
          evaluacionid: Number(formData.evaluacionid) || 1,
          cursoid: Number(formData.cursoid) || 1,
          orden: Number(formData.orden) || 1,
          nivel: Number(formData.nivel) || 1,
          codigo: formData.codigo || "GEN",
        }),
      });
      if (response.ok) {
        data = await response.json();
        if (!data.id) data.id = idUnico;
      } else {
        // Si el backend falla, crea el componente solo en frontend
        data = {
          id: idUnico,
          descripcion: formData.descripcion,
          peso: formData.peso,
        };
      }
    } catch (error) {
      // Si hay error de red, crea el componente solo en frontend
      data = {
        id: idUnico,
        descripcion: formData.descripcion,
        peso: formData.peso,
      };
    }
    setComponentes((prev) => [
      {
        id: data.id,
        descripcion: data.descripcion,
        peso: data.peso,
        competencias: [],
      },
      ...prev.filter((c) => String(c.id) !== String(data.id)), // Evita duplicados
    ]);
    setFormData({ ...formData, id: data.id });
    setSnackbar({
      open: true,
      message: "Componente guardado localmente.",
      severity: "success",
    });
    handleCloseDialog();
  };

  const handleDeleteComponente = async (idComponente) => {
    setComponenteAEliminar(idComponente);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (componenteAEliminar) {
      const result = await handleDelete(componenteAEliminar);
      setSnackbar({
        open: true,
        message: result.message,
        severity: result.success ? "success" : "error",
      });
      setComponenteAEliminar(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setComponenteAEliminar(null);
    setOpenDeleteDialog(false);
  };

  const handleOpenCompetenciasDialog = async (componente) => {
    try {
      setComponenteSeleccionado(componente);
      setCompetenciasIniciales(componente.competencias || []);
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al cargar las competencias",
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
    if (componenteSeleccionado) {
      // Solo actualizar el estado local, no guardar en la base de datos
      const componenteActualizado = {
        ...componenteSeleccionado,
        competencias: competenciasSeleccionadas,
      };
      setComponentes((prevComponentes) =>
        prevComponentes.map((comp) =>
          comp.id === componenteSeleccionado.id ? componenteActualizado : comp
        )
      );
      setSnackbar({
        open: true,
        message: "Competencias asociadas",
        severity: "success",
      });
      handleCloseCompetenciasDialog();
    }
  };

  const handleGuardarCompetenciasParaComponente = async (
    componente,
    competenciasSeleccionadas
  ) => {
    // Asociar cada competencia seleccionada al componente
    for (const competencia of competenciasSeleccionadas) {
      await fetch("http://localhost:8080/api/componente-competencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componenteId: componente.id,
          competenciaId: competencia.id,
          peso: componente.peso ?? 0,
        }),
      });
    }
  };

  const handleGuardarTodosLosCambios = async () => {
    const componentesAGuardar = componentes.filter(
      (c) => c.competencias && c.competencias.length > 0
    );
    if (componentesAGuardar.length === 0) {
      setSnackbar({
        open: true,
        message: "No hay componentes con competencias para guardar.",
        severity: "warning",
      });
      return;
    }
    try {
      let exito = true;
      for (const componente of componentesAGuardar) {
        await handleGuardarCompetenciasParaComponente(
          componente,
          componente.competencias
        );
      }
      setSnackbar({
        open: true,
        message: "Cambios guardados exitosamente.",
        severity: "success",
      });
      await cargarComponentes();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar los cambios.",
        severity: "error",
      });
    }
  };

  const componentesUnicos = componentes.filter(
    (comp, idx, arr) =>
      arr.findIndex((c) => String(c.id) === String(comp.id)) === idx
  );

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={60} />
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

          <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Agregar Componente
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Componentes
            </Typography>
            <Grid container spacing={2}>
              {componentesUnicos.map((componente) => (
                <Grid item xs={12} sm={6} md={4} key={componente.id}>
                  <ComponenteCompetenciaCard
                    componente={componente}
                    onDelete={() => handleDelete(componente.id)}
                    onEdit={() => handleOpenDialog(componente)}
                    onAddCompetencias={() =>
                      handleOpenCompetenciasDialog(componente)
                    }
                    onSave={async (comp) => {
                      // Guardar solo las competencias asociadas de este componente, peso null
                      if (comp.competencias && comp.competencias.length > 0) {
                        const token = localStorage.getItem("token");
                        for (const competencia of comp.competencias) {
                          await fetch(
                            "http://localhost:8080/api/componente-competencia",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                componenteId: comp.id,
                                competenciaId: competencia.id,
                                peso: null,
                              }),
                            }
                          );
                        }
                        setSnackbar({
                          open: true,
                          message: "Competencias guardadas para el componente.",
                          severity: "success",
                        });
                        await cargarComponentes();
                      } else {
                        setSnackbar({
                          open: true,
                          message: "No hay competencias para guardar.",
                          severity: "warning",
                        });
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Zoom}
            PaperProps={{
              sx: {
                bgcolor: "white",
                color: "black",
                borderRadius: 3,
              },
            }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <Typography variant="h6">
                {editingComponente ? "Editar componente" : "Agregar componente"}
              </Typography>
            </Box>
            <DialogContent sx={{ p: 3, bgcolor: "white", color: "black" }}>
              <Stack spacing={3}>
                <Autocomplete
                  options={componentesDisponibles.filter(
                    (comp, idx, arr) =>
                      arr.findIndex(
                        (c) => c.descripcion === comp.descripcion
                      ) === idx
                  )}
                  getOptionLabel={(option) => option.descripcion || ""}
                  filterOptions={(options, { inputValue }) => {
                    if (!inputValue) return options;
                    return options.filter((option) =>
                      option.descripcion
                        ?.toLowerCase()
                        .includes(inputValue.toLowerCase())
                    );
                  }}
                  value={
                    componentesDisponibles.find(
                      (c) => String(c.id) === String(formData.id)
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setFormData({
                        id: newValue.id,
                        descripcion: newValue.descripcion,
                        peso: newValue.peso ?? 0,
                        codigo: newValue.codigo || "GEN",
                      });
                    } else {
                      setFormData({
                        id: "",
                        descripcion: "",
                        peso: "",
                        codigo: "GEN",
                      });
                    }
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nombre del componente"
                      placeholder="Buscar o seleccionar un componente"
                      sx={{ bgcolor: "white", borderRadius: 1, color: "black" }}
                      InputLabelProps={{ style: { color: "black" } }}
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "black" },
                      }}
                    />
                  )}
                  noOptionsText="No se encontraron componentes"
                  loadingText="Cargando componentes..."
                />
                <TextField
                  fullWidth
                  label="Peso del componente"
                  type="number"
                  value={
                    formData.peso === undefined ||
                    formData.peso === null ||
                    isNaN(formData.peso)
                      ? ""
                      : formData.peso
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      peso: val === "" ? "" : parseFloat(val),
                    });
                  }}
                  sx={{ bgcolor: "white", borderRadius: 1, color: "black" }}
                  InputLabelProps={{ style: { color: "black" } }}
                  InputProps={{ style: { color: "black" } }}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ bgcolor: "transparent" }}>
              <Button
                onClick={handleCloseDialog}
                sx={{ color: "primary.main" }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveComponente}
                variant="contained"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#303f9f" },
                }}
              >
                Guardar
              </Button>
            </DialogActions>
          </Dialog>

          <CompetenciasDialog
            open={openCompetenciasDialog}
            onClose={handleCloseCompetenciasDialog}
            competenciasDisponibles={competenciasDisponibles}
            competenciasSeleccionadas={competenciasSeleccionadas}
            onToggleCompetencia={handleToggleCompetencia}
            onGuardar={handleGuardarCompetencias}
          />

          <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
            <DialogTitle>¿Está seguro de eliminar este componente?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Esta acción no se puede deshacer.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                color="error"
                variant="contained"
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>

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

export default AsociarComponentesPage;
