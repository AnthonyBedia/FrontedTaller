import React, { useEffect, useState } from "react";
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
    Box,
    TextField
} from "@mui/material";
import AddComponente from "./addComponente";
import ComponenteViewer from "./viewComponente";

export default function GrupoComponentes() {
    const [componentes, setComponentes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedComponente, setSelectedComponente] = useState(null);
    const [search, setSearch] = useState(""); // Nuevo estado para búsqueda


    useEffect(() => {
        fetchComponentes();
    }, []);

    const fetchComponentes = () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        fetch("https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/componentes", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data);
                setComponentes(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Error al obtener componentes:", err);
                setComponentes([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleComponenteAdded = (newComponente) => {
        // Agregar el nuevo componente a la lista
        setComponentes(prev => [...prev, newComponente]);
    };

    const openViewer = (comp) => {
        setSelectedComponente(comp);
        setShowViewModal(true);
    };

    // Filtrar componentes por búsqueda
    const componentesFiltrados = componentes.filter(comp =>
        comp.descripcion && comp.descripcion.toLowerCase().includes(search.toLowerCase())
    );

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

            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Buscar por descripción"
                    variant="outlined"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    fullWidth
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Código</strong></TableCell>
                            <TableCell><strong>Descripción</strong></TableCell>
                            <TableCell><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Cargando componentes...
                                </TableCell>
                            </TableRow>
                        ) : Array.isArray(componentesFiltrados) && componentesFiltrados.length > 0 ? (
                            componentesFiltrados.map((comp) => (
                                <TableRow key={comp.id}>
                                    <TableCell>{comp.codigo}</TableCell>
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No hay componentes disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddComponente
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                onComponenteAdded={handleComponenteAdded}
            />

            <ComponenteViewer
                show={showViewModal}
                handleClose={() => setShowViewModal(false)}
                componente={selectedComponente}
            />
        </Box>
    );
}