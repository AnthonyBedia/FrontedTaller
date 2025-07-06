import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Grid
} from '@mui/material';

const AddFormula = ({
    show,
    handleClose,
    handleSave,
    newformula,
    handleChange,
    handleCheckboxChange,
    applicables,
    funcionesDisponibles
}) => {
    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Añadir nueva fórmula</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Código"
                            name="codigo"
                            value={newformula.codigo}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Insertar descripción"
                            name="descripcion"
                            value={newformula.descripcion}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="funcion-select-label">Seleccionar función</InputLabel>
                            <Select
                                labelId="funcion-select-label"
                                name="funcionId"
                                value={newformula.funcionId}
                                label="Seleccionar función"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>-- Seleccione una función --</em>
                                </MenuItem>
                                {funcionesDisponibles.map((func) => (
                                    <MenuItem key={func.id} value={func.id}>
                                        {func.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <Grid container spacing={1}>
                                {applicables.map((label, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={newformula.applicable[index] === 1}
                                                    onChange={() => handleCheckboxChange(index)}
                                                />
                                            }
                                            label={label}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </FormGroup>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFormula;
