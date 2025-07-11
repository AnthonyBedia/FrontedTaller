import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack
} from '@mui/material';

const AddComponente = ({ show, handleClose, handleSave, newComponente, handleChange }) => {
    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Añadir nuevo componente</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Código"
                        name="codigo"
                        value={newComponente.codigo}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={newComponente.nombre}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Descripción"
                        name="descripcion"
                        value={newComponente.descripcion}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose} color="secondary">
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleSave} color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddComponente;
