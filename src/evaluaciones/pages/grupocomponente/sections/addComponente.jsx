import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Alert,
    Snackbar,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const AddComponente = ({ show, handleClose, onComponenteAdded }) => {
    const [formData, setFormData] = useState({
        codigo: "",
        descripcion: "",
        evaluacionid: "",
        peso: "",
        curso_id: "",
        orden: "",
        padreid: "",
        nivel: "",
        formulaid: "",
        calculado: false // Nuevo campo para controlar si el componente está calculado
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [componentes, setComponentes] = useState([]);
    const [formulas, setFormulas] = useState([]);
    // Cargar datos cuando se abre el modal
    useEffect(() => {
        if (show) {
            setFormData({
                codigo: "",
                descripcion: "",
                evaluacionid: "",
                peso: "",
                curso_id: "",
                orden: "",
                padreid: "",
                nivel: "",
                formulaid: "",
                calculado: false
            });
            setError("");
            setSuccess(false);
            fetchCursos();
            fetchEvaluaciones();
            fetchComponentes();
            fetchFormulas();
        }
    }, [show]);

    // Efecto para calcular nivel y orden automáticamente
    useEffect(() => {
        if (formData.padreid) {
            const padre = componentes.find(c => c.id == formData.padreid);
            if (padre) {
                // Nivel = nivel del padre + 1
                const nuevoNivel = Number(padre.nivel) + 1;
                // Orden = cantidad de hijos del padre + 1
                const hijos = componentes.filter(c => c.padreid == formData.padreid);
                const nuevoOrden = hijos.length + 1;
                setFormData(prev => ({
                    ...prev,
                    nivel: nuevoNivel,
                    orden: nuevoOrden
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                nivel: 1,
                orden: 1
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.padreid, componentes]);

    const fetchCursos = async () => {
        try {
            // Llamada a la API de Azure
            const response = await fetch("https://modcursosayudoc-e4b3fub9g5c5gda7.brazilsouth-01.azurewebsites.net/api-cur/v1/cursos");
            if (response.ok) {
                const data = await response.json();
                setCursos(data);
            }
        } catch (error) {
            console.error("Error al cargar cursos:", error);
        }
    };

    const fetchEvaluaciones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/evaluaciones", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEvaluaciones(data);
            }
        } catch (error) {
            console.error("Error al cargar evaluaciones:", error);
        }
    };

    const fetchComponentes = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/componentes", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setComponentes(data);
            }
        } catch (error) {
            console.error("Error al cargar componentes:", error);
        }
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getCursoNombre = (cursoId) => {
        if (!cursoId) return "";
        const curso = cursos.find(c => c.id == cursoId);
        return curso ? curso.nombre : "Curso no encontrado";
    };

    const getEvaluacionNombre = (evaluacionId) => {
        if (!evaluacionId) return "";
        const evaluacion = tiposEvaluacion.find(e => e.id == evaluacionId);
        return evaluacion ? `${evaluacion.nombre} (${evaluacion.codigo})` : "Evaluación no encontrada";
    };

    const getComponenteNombre = (componenteId) => {
        if (!componenteId) return "";
        const componente = componentes.find(c => c.id == componenteId);
        return componente ? componente.descripcion : "Componente no encontrado";
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const body = {
                codigo: formData.codigo,
                descripcion: formData.descripcion,
                evaluacionid: formData.evaluacionid ? Number(formData.evaluacionid) : null,
                peso: formData.peso ? Number(formData.peso) : null,
                estado: "1", // o "A" si tu sistema lo usa así
                cursoid: formData.curso_id ? Number(formData.curso_id) : null,
                orden: formData.orden ? Number(formData.orden) : null,
                padreid: formData.padreid ? Number(formData.padreid) : null,
                nivel: formData.nivel ? Number(formData.nivel) : null,
                institucionid: 1, // o el valor real
                calculado: formData.calculado ? "true" : "false",
                departamentoid: 3, // o el valor real
                formulaid: formData.formulaid ? Number(formData.formulaid) : null
            };
            console.log("Enviando al backend:", body); // Para depuración
            const response = await fetch("/api/componentes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const savedComponente = await response.json();
            setSuccess(true);

            if (onComponenteAdded) {
                onComponenteAdded(savedComponente);
            }

            setTimeout(() => {
                handleClose();
                setSuccess(false);
            }, 1500);

        } catch (err) {
            console.error("Error al guardar componente:", err);
            setError(err.message || "Error al guardar el componente");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            codigo: "", descripcion: "", evaluacionid: "", peso: "", 
            curso_id: "", orden: "", padreid: "", nivel: "", formulaid: "", calculado: false
        });
        setError("");
        handleClose();
    };

    const tiposEvaluacion = [
        { id: 1, codigo: "EES", nombre: "Evaluación Escrita" },
        { id: 2, codigo: "EOR", nombre: "Evaluación Oral" },
        { id: 3, codigo: "RBR", nombre: "Rúbrica" },
        { id: 4, codigo: "PRY", nombre: "Proyecto del curso" }
    ];

    return (
        <>
            <Dialog open={show} onClose={handleCancel} fullWidth maxWidth="sm">
                <DialogTitle>Añadir nuevo componente</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Código"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Descripción"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            required
                        />
                        <Box>
                            <FormControl fullWidth required>
                                <InputLabel id="evaluacionid-label">Tipo de Evaluación</InputLabel>
                                <Select
                                    labelId="evaluacionid-label"
                                    id="evaluacionid"
                                    name="evaluacionid"
                                    value={formData.evaluacionid || ""}
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
                            {formData.evaluacionid && (
                                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                    {getEvaluacionNombre(formData.evaluacionid)}
                                </Typography>
                            )}
                        </Box>
                        <TextField
                            label="Peso"
                            name="peso"
                            type="number"
                            value={formData.peso}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Box>
                            <TextField
                                label="ID de Curso"
                                name="curso_id"
                                type="number"
                                value={formData.curso_id}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="ID del curso al que pertenece este componente"
                            />
                            {formData.curso_id && (
                                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                    {getCursoNombre(formData.curso_id)}
                                </Typography>
                            )}
                        </Box>
                        <TextField
                            label="Orden"
                            name="orden"
                            type="number"
                            value={formData.orden}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Box>
                            <TextField
                                label="ID Padre (opcional)"
                                name="padreid"
                                type="number"
                                value={formData.padreid}
                                onChange={handleChange}
                                fullWidth
                                placeholder="ID del componente padre si es un subcomponente"
                            />
                            {formData.padreid && (
                                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                    {getComponenteNombre(formData.padreid)}
                                </Typography>
                            )}
                        </Box>
                        <TextField
                            label="Nivel"
                            name="nivel"
                            type="number"
                            value={formData.nivel}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Box>
                            <FormControl fullWidth required>
                                <InputLabel id="formulaid-label">Fórmula</InputLabel>
                                <Select
                                    labelId="formulaid-label"
                                    id="formulaid"
                                    name="formulaid"
                                    value={formData.formulaid || ""}
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
                        <Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.calculado}
                                        onChange={e => setFormData(prev => ({ ...prev, calculado: e.target.checked }))}
                                        name="calculado"
                                        color="primary"
                                    />
                                }
                                label="Calculado"
                            />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="outlined" 
                        onClick={handleCancel} 
                        color="secondary"
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        color="primary"
                        disabled={isLoading || !formData.codigo || !formData.descripcion || !formData.evaluacionid || !formData.curso_id || !formData.formulaid}
                    >
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={error !== ""} 
                autoHideDuration={6000} 
                onClose={() => setError("")}
            >
                <Alert severity="error" onClose={() => setError("")}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={success} 
                autoHideDuration={3000} 
                onClose={() => setSuccess(false)}
            >
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    Componente guardado exitosamente
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddComponente;