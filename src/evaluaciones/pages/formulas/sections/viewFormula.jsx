import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateFormula} from "../../../actions/evalThunks";

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
    const navigate= useNavigate();
    const location= useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [editableFormula, setEditableFormula] = useState(null);
    const [funcion, setFuncion]= useState(1);
    const dispatch= useDispatch();

    useEffect(() => {
        if (formula){
            setEditableFormula(formula);
            setIsEditing(false);
            setFuncion(formula.funcionId || 1)
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
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? "Editar fórmula" : "Detalle de la fórmula"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Código:</strong> {editableFormula.codigo}</p>
                <p><strong>Descripción:</strong> {editableFormula.descripcion}</p>
                <p><strong>Estado:</strong> {
                    editableFormula.estado === "1" ? "Activo" :
                    editableFormula.estado === "2" ? "Suspendido" :
                    editableFormula.estado
                }</p>
                <hr />
                    <p><strong>ID de la Institución:</strong> {editableFormula.institucionId}</p>
                    <p><strong>ID del departamento:</strong> {editableFormula.departamentoId}</p>
                    <p><strong>ID del instituto:</strong> {editableFormula.institutoid}</p>
                <hr />
                <Form>
                    <Form.Label><strong>Función asociada: </strong></Form.Label>
                        <Form.Select 
                            value={funcion}
                            onChange={handleFuncionChange}
                            disabled={!isEditing}
                        >
                            {funciones.map((fu)=>(
                                <option key={fu.id} value={fu.id}>{fu.nombre}</option>
                            ))}
                        </Form.Select>
                    <Form.Label><strong>Aplicabilidad: </strong></Form.Label>
                    {applicableLabels.map((label, idx) => (
                        <Form.Check
                            key={idx}
                            type="checkbox"
                            label={label}
                            checked={applicableValues[idx] === 1}
                            disabled={!isEditing}
                            onChange={() => handleCheckboxChange(idx)}
                        />
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {isEditing ? (
                    <>
                        <Button variant="primary" onClick={handleSave}>Guardar cambios</Button>
                        <Button variant="secondary" onClick={cancelEdit}>Cancelar</Button>
                    </>
                ) : (
                    <>
                        <Button variant="warning" onClick={toggleEdit}>Editar</Button>
                        <Button variant="outline-secondary" onClick={handleClose}>Cerrar</Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}
