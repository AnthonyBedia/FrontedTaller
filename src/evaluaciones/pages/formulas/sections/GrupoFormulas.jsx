import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Paper
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddFormula from './addFormula';
import DeleteFormula from './deleteFormula';
import ViewFormula from './viewFormula';
import { getFormulas, postFormula, deleteFormula, getFunciones } from "../../../actions/evalThunks";

const applicables = ["usapesos", "restamenor", "nummenor", "restamayor", "nummayor", "copiaprimero", "copiamenor", "copiamayor", "redondeo"];

export default function GrupoFormulas() {
    const dispatch = useDispatch();
    const { formulas } = useSelector((state) => state.formula);
    const { funciones } = useSelector((state) => state.funcion);

    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    const [selectedFormula, setSelectedFormula] = useState(null);

    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuTarget, setMenuTarget] = useState(null);

    const [newformula, setNewformula] = useState({
        codigo: "",
        descripcion: "",
        formula: "asd",
        funcionId: 0,
        estado: "1",
        institucionId: 1,
        institutoId: 1,
        departamentoId: 1,
        applicable: applicables.map(() => 0)
    });

    useEffect(() => {
        dispatch(getFormulas());
        dispatch(getFunciones());
    }, [dispatch]);

    const handleAddShow = () => setShowAddModal(true);
    const handleAddClose = () => {
        setShowAddModal(false);
        setNewformula({
            codigo: "",
            descripcion: "",
            formula: "asd",
            funcionId: 1,
            estado: "1",
            institucionId: 1,
            institutoId: 1,
            departamentoId: 1,
            applicable: applicables.map(() => 0)
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewformula((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        const payload = {
            codigo: newformula.codigo,
            descripcion: newformula.descripcion,
            formula: newformula.formula,
            funcionId: newformula.funcionId,
            estado: newformula.estado,
            institucionId: newformula.institucionId,
            departamentoId: newformula.departamentoId,
            usaPesos: newformula.applicable[0] ? 1 : 0,
            restaMenor: newformula.applicable[1] ? 1 : 0,
            numMenor: newformula.applicable[2] ? 1 : 0,
            restaMayor: newformula.applicable[3] ? 1 : 0,
            numMayor: newformula.applicable[4] ? 1 : 0,
            copiaPrimero: newformula.applicable[5] ? 1 : 0,
            copiaMenor: newformula.applicable[6] ? 1 : 0,
            copiaMayor: newformula.applicable[7] ? 1 : 0,
            redondeo: newformula.applicable[8] ? 1 : 0,
            institutoId: newformula.institutoId
        };
        dispatch(postFormula(payload));
        handleAddClose();
    };

    const handleCheckboxChange = (index) => {
        const nuevos = [...newformula.applicable];
        nuevos[index] = nuevos[index] === 1 ? 0 : 1;
        setNewformula((prev) => ({
            ...prev,
            applicable: nuevos
        }));
    };

    const handleDeleteShow = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
        handleCloseMenu();
    };

    const handleDeleteClose = () => {
        setDeleteId(null);
        setShowDeleteModal(false);
    };

    const handleViewFormula = (formula) => {
        setSelectedFormula(formula);
        setShowViewer(true);
        handleCloseMenu();
    };

    const handleCloseViewer = () => {
        setShowViewer(false);
        setSelectedFormula(null);
    };

    const handleDelete = (id) => {
        dispatch(deleteFormula(id));
        handleDeleteClose();
    };

    const handleMenuOpen = (event, formula) => {
        setMenuAnchor(event.currentTarget);
        setMenuTarget(formula);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
        setMenuTarget(null);
    };

    const estadoChipColor = (estado) => {
        switch (estado) {
            case "1": return "success";
            case "2": return "error";
            default: return "default";
        }
    };

    const estadoLabel = (estado) => {
        switch (estado) {
            case "1": return "Activo";
            case "2": return "Suspendido";
            default: return estado;
        }
    };

    return (
        <section>
            <Card sx={{ margin: 4 }}>
                <CardHeader title="Grupo de fórmulas" />
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Código</TableCell>
                                    <TableCell align="center">Descripción</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                    <TableCell align="center">Opciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formulas.map((f) => (
                                    <TableRow key={f.id}>
                                        <TableCell align="center">{f.codigo}</TableCell>
                                        <TableCell align="center">{f.descripcion}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={estadoLabel(f.estado)}
                                                color={estadoChipColor(f.estado)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={(e) => handleMenuOpen(e, f)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained" sx={{ marginTop: 2 }} onClick={handleAddShow}>
                        Añadir fórmula
                    </Button>
                </CardContent>
            </Card>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => handleViewFormula(menuTarget)}>Ver fórmula</MenuItem>
                <MenuItem onClick={() => handleDeleteShow(menuTarget?.id)}>Eliminar fórmula</MenuItem>
            </Menu>

            <AddFormula
                show={showAddModal}
                handleClose={handleAddClose}
                handleSave={handleSave}
                newformula={newformula}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                applicables={applicables}
                funcionesDisponibles={funciones}
            />
            <DeleteFormula
                show={showDeleteModal}
                handleClose={handleDeleteClose}
                handleDelete={() => handleDelete(deleteId)}
            />
            <ViewFormula
                show={showViewer}
                handleClose={handleCloseViewer}
                formula={selectedFormula}
                funciones={funciones}
            />
        </section>
    );
}
