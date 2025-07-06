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
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";

export function ComponenteCompetenciaCard({
  componente,
  onEdit,
  onDelete,
  onAddCompetencias,
  onSave,
}) {
  if (!componente) {
    return (
      <Box
        sx={{
          p: 2,
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
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        height: "auto",
        minWidth: 260,
        maxWidth: 340,
        mx: "auto",
        border: "2px solid rgba(0,0,0,0.15)",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s, background 0.2s, border 0.2s",
        background: "#fff",
        "&:hover": {
          boxShadow: "0 4px 16px 0 rgba(0,0,0,0.18)",
          border: "2.5px solid #222",
          background: "#f7f7f7",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ mb: 0.5, fontWeight: 600 }}
            >
              {componente.descripcion}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Peso:
              </Typography>
              <Chip
                label={`${componente.peso == null ? 0 : componente.peso}%`}
                size="small"
              />
            </Box>
          </Box>
          <MenuOpciones
            onEdit={() => onEdit(componente)}
            onDelete={() => onDelete(componente.descripcion)}
          />
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Competencias asociadas:
        </Typography>
        {componente.competencias && componente.competencias.length > 0 ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {componente.competencias.map((comp) => (
              <Chip
                key={comp.id}
                label={comp.nombre}
                size="small"
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Sin competencias asociadas
          </Typography>
        )}
        <Box
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Tooltip title="Guardar">
            <IconButton color="success" onClick={() => onSave(componente)}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar competencias">
            <IconButton
              color="primary"
              onClick={() => onAddCompetencias(componente)}
            >
              <AddIcon />
              <Typography
                variant="button"
                sx={{ ml: 0.5, fontWeight: 600, fontSize: 14 }}
              >
                Competencias
              </Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

function MenuOpciones({ onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
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
            onEdit();
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDelete();
          }}
        >
          Eliminar
        </MenuItem>
      </Menu>
    </>
  );
}

MenuOpciones.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

ComponenteCompetenciaCard.propTypes = {
  componente: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddCompetencias: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ComponenteCompetenciaCard;
