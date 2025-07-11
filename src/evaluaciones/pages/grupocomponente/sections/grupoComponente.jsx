import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Box
} from "@mui/material";
import AddComponente from "./addComponente";
import ComponenteViewer from "./viewComponente";

export default function GrupoComponentes() {
    const [componentes, setComponentes] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedComponente, setSelectedComponente] = useState(null);

    const [newComponente, setNewComponente] = useState({
        codigo: "",
        nombre: "",
        evaluacionid: "",
        peso: "",
        orden: "",
        estado: "",
        padreid: "",
        nivel: "",
        institucionalid: "",
        calculado: "",
        departamentoid: "",
        formulaid: "",
        curso_id: ""
    });

    useEffect(() => {
        fetchComponentes();
    }, []);

    const fetchComponentes = () => {
        axios.get("http://localhost:8080/api/componente")
            .then(res => setComponentes(res.data))
            .catch(err => console.error("Error al obtener componentes:", err));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewComponente(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        axios.post("http://localhost:8080/api/componente", newComponente)
            .then(() => {
                setShowAddModal(false);
                setNewComponente({
                    codigo: "", nombre: "", evaluacionid: "", peso: "", orden: "",
                    estado: "", padreid: "", nivel: "", institucionalid: "", calculado: "",
                    departamentoid: "", formulaid: "", curso_id: ""
                });
                fetchComponentes();
            })
            .catch(err => console.error("Error al guardar el componente:", err));
    };

    const openViewer = (comp) => {
        setSelectedComponente(comp);
        setShowViewModal(true);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Gestión de Componentes
            </Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setShowAddModal(true)}
            >
                Añadir Componente
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Código</strong></TableCell>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Descripción</strong></TableCell>
                            <TableCell><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {componentes.map((comp) => (
                            <TableRow key={comp.id}>
                                <TableCell>{comp.codigo}</TableCell>
                                <TableCell>{comp.nombre}</TableCell>
                                <TableCell>{comp.descripcion}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="info"
                                        onClick={() => openViewer(comp)}
                                    >
                                        Ver
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddComponente
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                handleSave={handleSave}
                newComponente={newComponente}
                handleChange={handleChange}
            />

            <ComponenteViewer
                show={showViewModal}
                handleClose={() => setShowViewModal(false)}
                componente={selectedComponente}
            />
        </Box>
    );
}
