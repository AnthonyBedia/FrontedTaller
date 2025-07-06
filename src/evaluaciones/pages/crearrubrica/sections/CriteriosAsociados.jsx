import { TextField, Typography, Paper, Grid, IconButton } from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CriteriosAsociados({ rubricaInfo, setRubricaInfo }) {
    const [criterioDesc, setCriterioDesc] = useState("");
    const [niveles, setNiveles] = useState([]);
    const [nivel, setNivel] = useState({ titulo: "", descripcion: "", puntajemax: "" });

    const agregarNivel = () => {
        if (!nivel.titulo || !nivel.descripcion || !nivel.puntajemax) return;
        setNiveles([...niveles, nivel]);
        setNivel({ titulo: "", descripcion: "", puntajemax: "" });
    };

    const eliminarNivel = (index) => {
        setNiveles(niveles.filter((_, i) => i !== index));
    };
    
    const agregarCriterio = () => {
        if (!criterioDesc || niveles.length === 0) return;

        const nuevoCriterio = {
            descripcion: criterioDesc,
            estado: "ACTIVO",
            niveles: niveles.map(n => ({
                titulo: n.titulo,
                descripcion: n.descripcion,
                puntajemax: parseInt(n.puntajemax, 10)
            })),
        };

        setRubricaInfo(prev => ({
            ...prev,
            criterios: [...prev.criterios, nuevoCriterio],
        }));

        setCriterioDesc("");
        setNiveles([]);
    };

    const eliminarCriterio = (index) => {
        setRubricaInfo(prev => ({
            ...prev,
            criterios: prev.criterios.filter((_, i) => i !== index)
        }));
    };

    return (
        <section>
            <div>
                <h3 className="h3-text">Crear criterios para la rúbrica</h3>
                <div className="criterios-rubrica-container">
                    <div className="fila-desc">
                        <TextField
                            label="Descripción del criterio"
                            variant="outlined"
                            value={criterioDesc}
                            onChange={(e) => setCriterioDesc(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            style={{ marginTop: "1rem" }}
                        />
                    </div>

                    <div className="criterio-rubrica">
                        <TextField
                            label="Título del nivel"
                            value={nivel.titulo}
                            onChange={(e) => setNivel({ ...nivel, titulo: e.target.value })}
                            style={{ marginRight: "1rem" }}
                        />
                        <TextField
                            label="Descripción del nivel"
                            value={nivel.descripcion}
                            onChange={(e) => setNivel({ ...nivel, descripcion: e.target.value })}
                            style={{ marginRight: "1rem" }}
                        />
                        <TextField
                            label="Puntaje máximo"
                            type="number"
                            value={nivel.puntajemax}
                            onChange={(e) => setNivel({ ...nivel, puntajemax: e.target.value })}
                        />
                        <button
                            className="criterio-more"
                            onClick={agregarNivel}
                        >
                            +
                        </button>
                    </div>

                    {niveles.length > 0 && (
                        <div style={{ marginTop: "1rem" }}>
                            <Typography variant="subtitle1">Niveles agregados:</Typography>
                            <Grid container spacing={1} style={{ marginTop: "0.5rem" }}>
                                {niveles.map((n, i) => (
                                    <Grid item xs={12} key={i}>
                                        <Paper elevation={2} style={{ padding: "0.75rem", backgroundColor: "#f5f5f5" }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={3}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {n.titulo}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2">{n.descripcion}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography variant="body2">
                                                        Puntaje máx: {n.puntajemax}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1} style={{ textAlign: "right" }}>
                                                    <IconButton onClick={() => eliminarNivel(i)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    )}

                    <button
                        className="btn-añadir-criterio"
                        onClick={agregarCriterio}
                    >
                        Añadir un criterio
                    </button>

                    {rubricaInfo.criterios?.length > 0 && (
                        <div style={{ marginTop: "2rem" }}>
                            <Typography variant="h6">Criterios agregados:</Typography>
                            <Grid container spacing={2} style={{ marginTop: "0.5rem" }}>
                                {rubricaInfo.criterios.map((criterio, i) => (
                                    <Grid item xs={12} key={i}>
                                        <Paper elevation={3} style={{ padding: "1rem", backgroundColor: "#e3f2fd" }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={11}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        {criterio.descripcion}
                                                    </Typography>
                                                    {criterio.niveles.map((n, j) => (
                                                        <Grid container spacing={1} key={j} style={{ marginBottom: "0.5rem" }}>
                                                            <Grid item xs={3}>
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    {n.titulo}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography variant="body2">
                                                                    {n.descripcion}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <Typography variant="body2">
                                                                    Puntaje máx: {n.puntajemax}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <IconButton onClick={() => eliminarCriterio(i)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
