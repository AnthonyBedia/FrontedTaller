import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { updateFormula } from "../../../actions/evalThunks";

const applicableLabels = [
    "Usa Pesos",
    "Resta Menor",
    "Número Menor",
    "Resta Mayor",
    "Número Mayor",
    "Copia Primero",
    "Copia Menor",
    "Copia Mayor",
    "Redondeo"
];

export default function FormulaViewer({ show, handleClose, formula, funciones }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [editableFormula, setEditableFormula] = useState(null);
    const [funcion, setFuncion] = useState(1);

    useEffect(() => {
        if (formula) {
            setEditableFormula(formula);
            setIsEditing(false);
            setFuncion(formula.funcionId || 1);
        }
    }, [formula]);

    const toggleEdit = () => setIsEditing(true);
    const cancelEdit = () => {
        setEditableFormula(formula);
        setIsEditing(false);
    };

    const handleFuncionChange = (event) => {
        const selectedId = parseInt(event.target.value);
        setFuncion(selectedId);
        setEditableFormula((prev) => ({
            ...prev,
            funcionId: selectedId
        }));
    };

    const handleCheckboxChange = (index) => {
        const keys = [
            "usaPesos", "restaMenor", "numMenor", "restaMayor",
            "numMayor", "copiaPrimero", "copiaMenor", "copiaMayor", "redondeo"
        ];
        const key = keys[index];

        setEditableFormula((prev) => ({
            ...prev,
            [key]: prev[key] === 1 ? 0 : 1
        }));
    };

    const handleSave = () => {
        dispatch(updateFormula(editableFormula))
            .then(() => {
                setIsEditing(false);
                handleClose();
                window.location.reload();
            })
            .catch((err) => {
                console.error("Error al actualizar la fórmula:", err);
            });
    };

    if (!editableFormula) return null;

    const applicableValues = [
        editableFormula.usaPesos,
        editableFormula.restaMenor,
        editableFormula.numMenor,
        editableFormula.restaMayor,
        editableFormula.numMayor,
        editableFormula.copiaPrimero,
        editableFormula.copiaMenor,
        editableFormula.copiaMayor,
        editableFormula.redondeo
    ];

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEditing ? "Editar fórmula" : "Detalle de la fórmula"}
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1"><strong>Código:</strong> {editableFormula.codigo}</Typography>
                <Typography variant="body1"><strong>Descripción:</strong> {editableFormula.descripcion}</Typography>
                <Typography variant="body1">
                    <strong>Estado:</strong>{" "}
                    {editableFormula.estado === "1"
                        ? "Activo"
                        : editableFormula.estado === "2"
                        ? "Suspendido"
                        : editableFormula.estado}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2"><strong>ID de la Institución:</strong> {editableFormula.institucionId}</Typography>
                <Typography variant="body2"><strong>ID del Departamento:</strong> {editableFormula.departamentoId}</Typography>
                <Typography variant="body2"><strong>ID del Instituto:</strong> {editableFormula.institutoid}</Typography>

                <Divider sx={{ my: 2 }} />

                <FormControl fullWidth sx={{ my: 2 }} disabled={!isEditing}>
                    <InputLabel id="funcion-select-label">Función asociada</InputLabel>
                    <Select
                        labelId="funcion-select-label"
                        value={funcion}
                        onChange={handleFuncionChange}
                        label="Función asociada"
                    >
                        {funciones.map((fu) => (
                            <MenuItem key={fu.id} value={fu.id}>{fu.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mt: 2 }}><strong>Aplicabilidad:</strong></Typography>
                <FormGroup>
                    {applicableLabels.map((label, idx) => (
                        <FormControlLabel
                            key={idx}
                            control={
                                <Checkbox
                                    checked={applicableValues[idx] === 1}
                                    onChange={() => handleCheckboxChange(idx)}
                                    disabled={!isEditing}
                                />
                            }
                            label={label}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                {isEditing ? (
                    <>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Guardar cambios
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={cancelEdit}>
                            Cancelar
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="contained" color="warning" onClick={toggleEdit}>
                            Editar
                        </Button>
                        <Button variant="outlined" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
