import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import GrupoCursos from "./sections/grupoCursos";

export default function AsignarFormula(){
    const navigate= useNavigate();

    return(
        <main>
            <Button onClick={()=> navigate("../")}>Ir a inicio</Button>
            <GrupoCursos/>
        </main>
    );
}