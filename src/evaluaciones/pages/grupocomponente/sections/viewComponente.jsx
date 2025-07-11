import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Typography,
    Box
} from "@mui/material";

export default function ComponenteViewer({ show, handleClose, componente }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editableComponente, setEditableComponente] = useState(null);
    const [formulas, setFormulas] = useState([]);

    useEffect(() => {
        if (componente) {
            setEditableComponente(componente);
            setIsEditing(false);
        }
    }, [componente]);

    useEffect(() => {
        // Cargar fórmulas desde la API como en AddComponente
        const fetchFormulas = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/formula", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormulas(data);
                }
            } catch (error) {
                console.error("Error al cargar fórmulas:", error);
            }
        };
        fetchFormulas();
    }, []);

    const toggleEdit = () => setIsEditing(true);

    const cancelEdit = () => {
        setEditableComponente(componente);
        setIsEditing(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditableComponente((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = () => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este componente?")) return;
        const token = localStorage.getItem("token");
        fetch(`https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/componentes/${editableComponente.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar el componente");
                handleClose();
                window.location.reload();
            })
            .catch((err) => {
                alert("Error al eliminar el componente");
                console.error("Error al eliminar el componente:", err);
            });
    };

    const handleSave = () => {
        const token = localStorage.getItem("token");
        // Asegúrate de enviar los campos correctos y tipos como en addComponente
        const body = {
            codigo: editableComponente.codigo,
            descripcion: editableComponente.descripcion,
            evaluacionid: editableComponente.evaluacionid ? Number(editableComponente.evaluacionid) : null,
            peso: editableComponente.peso ? Number(editableComponente.peso) : null,
            estado: "1",
            cursoid: editableComponente.cursoid ? Number(editableComponente.cursoid) : null,
            orden: editableComponente.orden ? Number(editableComponente.orden) : null,
            padreid: editableComponente.padreid ? Number(editableComponente.padreid) : null,
            nivel: editableComponente.nivel ? Number(editableComponente.nivel) : null,
            institucionid: 1,
            calculado: editableComponente.calculado ? "true" : "false",
            departamentoid: 3,
            formulaid: editableComponente.formulaid ? Number(editableComponente.formulaid) : null
        };
        fetch(`https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/componentes/${editableComponente.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
            .then(() => {
                setIsEditing(false);
                handleClose();
                window.location.reload();
            })
            .catch((err) => {
                console.error("Error al actualizar el componente:", err);
            });
    };

    if (!editableComponente) return null;

    // Agrega las constantes y helpers necesarios
    const tiposEvaluacion = [
        { id: 1, codigo: "EES", nombre: "Evaluación Escrita" },
        { id: 2, codigo: "EOR", nombre: "Evaluación Oral" },
        { id: 3, codigo: "RBR", nombre: "Rúbrica" },
        { id: 4, codigo: "PRY", nombre: "Proyecto del curso" }
    ];

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEditing ? "Editar componente" : "Detalle del componente"}
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Código"
                        name="codigo"
                        value={editableComponente.codigo}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditing}
                    />
                    <TextField
                        label="Descripción"
                        name="descripcion"
                        value={editableComponente.descripcion}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        disabled={!isEditing}
                    />
                    <Box>
                        <FormControl fullWidth required disabled={!isEditing}>
                            <InputLabel id="evaluacionid-label">Tipo de Evaluación</InputLabel>
                            <Select
                                labelId="evaluacionid-label"
                                id="evaluacionid"
                                name="evaluacionid"
                                value={editableComponente.evaluacionid || ""}
                                label="Tipo de Evaluación"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Seleccione un tipo de evaluación</em>
                                </MenuItem>
                                {tiposEvaluacion.map(e => (
                                    <MenuItem key={e.id} value={e.id}>
                                        {e.nombre} ({e.codigo})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField
                        label="Peso"
                        name="peso"
                        type="number"
                        value={editableComponente.peso}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditing}
                    />
                    <TextField
                        label="ID de Curso"
                        name="cursoid"
                        type="number"
                        value={editableComponente.cursoid}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditing}
                    />
                    <TextField
                        label="Orden"
                        name="orden"
                        type="number"
                        value={editableComponente.orden}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditing}
                    />
                    <TextField
                        label="ID Padre (opcional)"
                        name="padreid"
                        type="number"
                        value={editableComponente.padreid}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditing}
                    />
                    <TextField
                        label="Nivel"
                        name="nivel"
                        type="number"
                        value={editableComponente.nivel}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditing}
                    />
                    <TextField
                        label="Departamento ID"
                        name="departamentoid"
                        type="number"
                        value={editableComponente.departamentoid}
                        onChange={handleChange}
                        fullWidth
                        disabled={!isEditing}
                    />
                    <Box>
                        <FormControl fullWidth required disabled={!isEditing}>
                            <InputLabel id="formulaid-label">Fórmula</InputLabel>
                            <Select
                                labelId="formulaid-label"
                                id="formulaid"
                                name="formulaid"
                                value={editableComponente.formulaid || ""}
                                label="Fórmula"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Seleccione una fórmula</em>
                                </MenuItem>
                                {formulas.map(f => (
                                    <MenuItem key={f.id} value={f.id}>
                                        {f.nombre || f.descripcion || `Fórmula ${f.id}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={editableComponente.calculado === "true" || editableComponente.calculado === true}
                                onChange={e => setEditableComponente(prev => ({ ...prev, calculado: e.target.checked ? "true" : "false" }))}
                                name="calculado"
                                color="primary"
                                disabled={!isEditing}
                            />
                        }
                        label="Calculado"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                {isEditing ? (
                    <>
                        <Button variant="outlined" color="secondary" onClick={cancelEdit}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Guardar
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Eliminar
                        </Button>
                    </>
                ) : (
                    <Button variant="contained" color="warning" onClick={toggleEdit}>
                        Editar
                    </Button>
                )}
                <Button variant="outlined" onClick={handleClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}