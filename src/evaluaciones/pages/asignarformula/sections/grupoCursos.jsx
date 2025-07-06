import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
    iniciaCargaFormulas,
    cargaFormulas
} from "../../../slices/formulaSlice";

export default function GrupoCursos() {
    const dispatch = useDispatch();
    const { formulas } = useSelector((state) => state.formula);
    const [editingRowId, setEditingRowId] = useState(null);
    const [componentes, setComponentes] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const handleFormulaChange = (event, compId) => {
        const selectedId = parseInt(event.target.value);
        setComponentes(prev =>
            prev.map(comp =>
                comp.id === compId ? { ...comp, formulaid: selectedId } : comp
            )
        );
    };

    const toggleEdit = (id) => setEditingRowId(id);
    const cancelEdit = () => setEditingRowId(null);

    useEffect(() => {
        const fetchFormulas = async () => {
            dispatch(iniciaCargaFormulas());
            try {
                const res = await axios.get("http://localhost:8080/api/formula");
                dispatch(cargaFormulas({
                    formulas: res.data.map(f => ({
                        id: f.id,
                        descripcion: f.descripcion
                    }))
                }));
            } catch (err) {
                console.error("Error cargando fórmulas:", err);
            }
        };
        fetchFormulas();
    }, [dispatch]);

    useEffect(() => {
        const fetchComponentes = async () => {
            try {
                const res = await axios.get("http://localhost:8080/componentes");
                setComponentes(res.data);
            } catch (err) {
                console.error("Error cargando componentes:", err);
            }
        };
        fetchComponentes();
    }, []);


    const handleSave = async () => {
        const componenteEditado = componentes.find(c => c.id === editingRowId);
        if (!componenteEditado) return;

        try {
            await axios.put(`http://localhost:8080/componentes/${componenteEditado.id}`, componenteEditado, {
                formulaid: componenteEditado.formulaid
            });
            setEditingRowId(null);
        } catch (error) {
            console.error("Error al guardar el componente:", error);
        }
    };

    return (
        <section>
            <Card className="m-4 p-2">
                <Card.Title>Curso: </Card.Title>
                <Card.Body>
                    <Table>
                        <thead>
                            <tr className="text-center">
                                <th>Codigo</th>
                                <th>Descripción del componente</th>
                                <th>Peso del componente</th>
                                <th>Fórmula asociada</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {componentes.map((comp) => (
                                <tr key={comp.id}>
                                    <td>{comp.codigo}</td>
                                    <td>{comp.descripcion}</td>
                                    <td>{comp.peso}</td>
                                    <td>
                                        <Form>
                                            <Form.Select
                                                value={comp.formulaid}
                                                onChange={(e) => handleFormulaChange(e, comp.id)}
                                                disabled={editingRowId !== comp.id}
                                            >
                                                {formulas.map((f) => (
                                                    <option key={f.id} value={f.id}>
                                                        {f.descripcion}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form>
                                    </td>
                                    <td>
                                        {editingRowId === comp.id ? (
                                            <>
                                                <Button variant="success" size="sm" onClick={handleSave}>
                                                    Guardar
                                                </Button>{' '}
                                                <Button variant="secondary" size="sm" onClick={cancelEdit}>
                                                    Cancelar
                                                </Button>
                                            </>
                                        ) : (
                                            <Button size="sm" onClick={() => toggleEdit(comp.id)}>
                                                Editar
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button>Añadir fórmula</Button>
                </Card.Body>
            </Card>
        </section>
    );
}
