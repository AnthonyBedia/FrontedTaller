import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import GrupoFormulas from "./sections/GrupoFormulas";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Formulas(){
    const navigate= useNavigate();

    return(
        <main>
            <Button onClick={()=> navigate("../")}>Ir a inicio</Button>
            <GrupoFormulas/>
        </main>
    );
}