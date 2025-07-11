import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack
} from "@mui/material";
import axios from "axios";

export default function ComponenteViewer({ show, handleClose, componente }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editableComponente, setEditableComponente] = useState(null);

    useEffect(() => {
        if (componente) {
            setEditableComponente(componente);
            setIsEditing(false);
        }
    }, [componente]);

    const toggleEdit = () => setIsEditing(true);

    const cancelEdit = () => {
        setEditableComponente(componente);
        setIsEditing(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditableComponente((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        axios
            .put(`http://localhost:8080/api/componente/${editableComponente.id}`, editableComponente)
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
                        label="Nombre"
                        name="nombre"
                        value={editableComponente.nombre}
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
