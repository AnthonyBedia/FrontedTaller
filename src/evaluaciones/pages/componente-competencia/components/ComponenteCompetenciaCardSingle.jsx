import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";
import { ConfirmarEliminacionDialog } from "../../componente/dialogs/ConfirmarEliminacionDialog";

export function ComponenteCompetenciaCardSingle({
  componente,
  onEdit,
  onDelete,
  onAddCompetencias,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(componente.id);
    setOpenDeleteDialog(false);
  };

  if (!componente) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No hay componentes asociados
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 0.5 }}>
                {componente.descripcion}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  Peso:
                </Typography>
                <Chip label={`${componente.peso || 0}%`} size="small" />
              </Box>
            </Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onEdit(componente);
                }}
              >
                Editar
              </MenuItem>
              <MenuItem onClick={handleDeleteClick}>Eliminar</MenuItem>
            </Menu>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Competencias asociadas:
          </Typography>
          {componente.competencias && componente.competencias.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {[...new Set(componente.competencias.map((comp) => comp.id))].map(
                (compId) => {
                  const comp = componente.competencias.find(
                    (c) => c.id === compId
                  );
                  return (
                    <Chip
                      key={`competencia-${componente.id}-${compId}-${comp.nombre}`}
                      label={comp.nombre}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  );
                }
              )}
            </Stack>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              Sin competencias asociadas
            </Typography>
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Chip
              label={"+ ASOCIAR"}
              color="primary"
              clickable
              onClick={() => onAddCompetencias(componente)}
              sx={{ fontWeight: 600, letterSpacing: 1 }}
            />
          </Box>
        </CardContent>
      </Card>

      <ConfirmarEliminacionDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

ComponenteCompetenciaCardSingle.propTypes = {
  componente: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddCompetencias: PropTypes.func.isRequired,
};
