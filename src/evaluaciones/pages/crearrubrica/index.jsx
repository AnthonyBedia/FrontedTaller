import { useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MainInfo from "./sections/MainInfo";
import ExtraInfo from "./sections/ExtraInfo";
import CriteriosAsociados from "./sections/CriteriosAsociados";
import { postRubrica } from "../../actions/evalThunks";
import "../../views/crearRubricaStyles.css";

export default function CrearRubrica(){
    const navigate= useNavigate();
    const dispatch = useDispatch();

    const [rubricaInfo, setRubricaInfo] = useState({
        nombre: "",
        descripcion: "",
        estado: "ACTIVO",
        criterios: [],
        componenteId: null,
    });

    const handleGuardarRubrica = () => {
        const rubricaData = {
            nombre: rubricaInfo.nombre,
            descripcion: rubricaInfo.descripcion,
            estado: rubricaInfo.estado,
            criterios: rubricaInfo.criterios,
        };
        dispatch(postRubrica(rubricaData));
    };

    return(
        <main>
            <div className="crear-rubrica-layout">
                <div className="main-crear-rubrica-container">
                    <Button onClick={()=> navigate("../")}>Ir a inicio</Button>
                    <MainInfo rubricaInfo={rubricaInfo} setRubricaInfo={setRubricaInfo}/>
                    <CriteriosAsociados rubricaInfo={rubricaInfo} setRubricaInfo={setRubricaInfo}/>
                </div>
                <div className="extra-info-crear-rubrica">
                    <ExtraInfo
                        rubricaInfo={rubricaInfo}
                        setRubricaInfo={setRubricaInfo}
                        onGuardar={handleGuardarRubrica}
                    />
                </div>
            </div>
        </main>
    );
}