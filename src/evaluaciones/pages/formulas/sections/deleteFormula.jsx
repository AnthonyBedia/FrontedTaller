import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteFormula({show, handleClose, handleDelete}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de eliminar una fórmula?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
}

export default DeleteFormula;