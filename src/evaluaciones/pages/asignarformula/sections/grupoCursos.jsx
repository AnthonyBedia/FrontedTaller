import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel
} from "@mui/material";
import { getFormulas, getComponentes, updateComponente, postComponente } from "../../../actions/evalThunks";

export default function GrupoCursos() {
  const dispatch = useDispatch();
  const { formulas } = useSelector((state) => state.formula);
  const [componentes, setComponentes] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nuevoComponente, setNuevoComponente] = useState({
    codigo: "",
    descripcion: "",
    peso: "",
    formulaid: ""
  });

  const handleFormulaChange = (event, compId) => {
    const selectedId = parseInt(event.target.value);
    setComponentes(prev =>
      prev.map(comp =>
        comp.id === compId ? { ...comp, formulaid: selectedId } : comp
      )
    );
  };

  const toggleEdit = (id) => setEditingRowId(id);
  const cancelEdit = () => setEditingRowId(null);

  const handleSave = async () => {
    const componenteEditado = componentes.find(c => c.id === editingRowId);
    if (!componenteEditado) return;
    await dispatch(updateComponente(componenteEditado));
    setEditingRowId(null);
    dispatch(getComponentes()).then(res => setComponentes(res.payload));
  };

  useEffect(() => {
    dispatch(getFormulas());
    dispatch(getComponentes()).then(res => setComponentes(res.payload));
  }, [dispatch]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNuevoComponente({
      codigo: "",
      descripcion: "",
      peso: "",
      formulaid: ""
    });
  };

  const handleNuevoChange = (e) => {
    const { name, value } = e.target;
    setNuevoComponente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgregarComponente = async (e) => {
    e.preventDefault();
    await dispatch(postComponente(nuevoComponente));
    dispatch(getComponentes()).then(res => setComponentes(res.payload));
    handleCloseModal();
  };

  return (
    <section>
      <Card sx={{ margin: 4, padding: 2 }}>
        <CardContent>
          <Typography variant="h6">Curso:</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Código</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Peso</TableCell>
                <TableCell align="center">Fórmula asociada</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {componentes.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell align="center">{comp.codigo}</TableCell>
                  <TableCell align="center">{comp.descripcion}</TableCell>
                  <TableCell align="center">{comp.peso}</TableCell>
                  <TableCell align="center">
                    <FormControl fullWidth>
                      <Select
                        value={comp.formulaid}
                        onChange={(e) => handleFormulaChange(e, comp.id)}
                        disabled={editingRowId !== comp.id}
                      >
                        {formulas.map((f) => (
                          <MenuItem key={f.id} value={f.id}>
                            {f.descripcion}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    {editingRowId === comp.id ? (
                      <>
                        <Button variant="contained" color="success" size="small" onClick={handleSave}>
                          Guardar
                        </Button>{" "}
                        <Button variant="outlined" size="small" onClick={cancelEdit}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button size="small" variant="contained" onClick={() => toggleEdit(comp.id)}>
                        Editar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div style={{ display: "flex", marginTop: "1rem", gap: "1rem" }}>
            <Button variant="outlined">Añadir fórmula</Button>
            <Button variant="contained" onClick={handleShowModal}>
              Añadir componente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Añadir nuevo componente</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Código"
            name="codigo"
            fullWidth
            value={nuevoComponente.codigo}
            onChange={handleNuevoChange}
          />
          <TextField
            margin="dense"
            label="Descripción"
            name="descripcion"
            fullWidth
            value={nuevoComponente.descripcion}
            onChange={handleNuevoChange}
          />
          <TextField
            margin="dense"
            label="Peso"
            name="peso"
            type="number"
            fullWidth
            value={nuevoComponente.peso}
            onChange={handleNuevoChange}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="formula-label">Fórmula</InputLabel>
            <Select
              labelId="formula-label"
              name="formulaid"
              value={nuevoComponente.formulaid}
              onChange={handleNuevoChange}
              label="Fórmula"
            >
              <MenuItem value="">Seleccione una fórmula</MenuItem>
              {formulas.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleAgregarComponente}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
