import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

function DeleteFormula({ show, handleClose, handleDelete }) {
    return (
        <Dialog
            open={show}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    ¿Está seguro de eliminar una fórmula?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="secondary">
                    Cerrar
                </Button>
                <Button onClick={handleDelete} variant="contained" color="error">
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteFormula;
