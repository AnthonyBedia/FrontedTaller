import React from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';

const AddFormula = ({ show, handleClose, handleSave, newformula, handleChange, handleCheckboxChange, applicables, funcionesDisponibles }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Añadir nueva fórmula</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formCode">
                        <Form.Label>Código</Form.Label>
                        <Form.Control
                            type="text"
                            name="codigo"
                            value={newformula.codigo}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDesc">
                        <Form.Label>Insertar descripción</Form.Label>
                        <Form.Control
                            type="text"
                            name="descripcion"
                            value={newformula.descripcion}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formFuncionId">
                        <Form.Label>Seleccionar función</Form.Label>
                        <Form.Select
                            name="funcionId"
                            value={newformula.funcionId}
                            onChange={handleChange}
                        >
                            <option value="">-- Seleccione una función --</option>
                            {funcionesDisponibles.map(func => (
                                <option key={func.id} value={func.id}>
                                    {func.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Criterios adicionales</Form.Label>
                        <Row>
                            {applicables.map((label, index) => (
                                <Col key={index} md={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label={label}
                                        checked={newformula.applicable[index] === 1}
                                        onChange={() => handleCheckboxChange(index)}
                                        className="mb-2"
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddFormula;
