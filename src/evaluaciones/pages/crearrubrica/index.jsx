import { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MainInfo from "./sections/MainInfo";
import ExtraInfo from "./sections/ExtraInfo";
import CriteriosAsociados from "./sections/CriteriosAsociados";
import { postRubrica } from "../../actions/evalThunks";
import "../../views/crearRubricaStyles.css";

export default function CrearRubrica() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [rubricaInfo, setRubricaInfo] = useState({
        nombre: "",
        descripcion: "",
        estado: "ACTIVO",
        criterios: [],
        componenteId: null,
        cursoId: null
    });

    const [selectedComp, setSelectedComp] = useState(null);
    const [selectedCur, setSelectedCur] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleGuardarRubrica = () => {
        const confirm = window.confirm("¿Estás seguro de que deseas crear esta rúbrica?");
        if (!confirm) return;

        const rubricaData = {
            nombre: rubricaInfo.nombre,
            descripcion: rubricaInfo.descripcion,
            estado: rubricaInfo.estado,
            criterios: rubricaInfo.criterios,
            componenteid: rubricaInfo.componenteId,
            cursoid: rubricaInfo.cursoId
        };

        dispatch(postRubrica(rubricaData));
        console.log("Rúbrica enviada:", rubricaData);
        setSnackbarOpen(true);

        // Limpiar todos los valores
        setRubricaInfo({
            nombre: "",
            descripcion: "",
            estado: "ACTIVO",
            criterios: [],
            componenteId: null,
            cursoId: null
        });

        setSelectedComp(null);
        setSelectedCur(null);
    };

    return (
        <main>
            <div className="crear-rubrica-layout">
                <div className="main-crear-rubrica-container">
                    <Button onClick={() => navigate("../")}>Ir a inicio</Button>
                    <MainInfo rubricaInfo={rubricaInfo} setRubricaInfo={setRubricaInfo} />
                    <CriteriosAsociados rubricaInfo={rubricaInfo} setRubricaInfo={setRubricaInfo} />
                </div>
                <div className="extra-info-crear-rubrica">
                    <ExtraInfo
                        rubricaInfo={rubricaInfo}
                        setRubricaInfo={setRubricaInfo}
                        onGuardar={handleGuardarRubrica}
                        selectedComp={selectedComp}
                        selectedCur={selectedCur}
                        setSelectedComp={setSelectedComp}
                        setSelectedCur={setSelectedCur}
                    />
                </div>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    ¡Rúbrica guardada exitosamente!
                </Alert>
            </Snackbar>
        </main>
    );
}
