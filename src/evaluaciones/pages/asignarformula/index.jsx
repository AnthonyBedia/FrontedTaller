import React from "react";
import { useNavigate } from "react-router-dom";
import GrupoCursos from "./sections/grupoCursos";

export default function AsignarFormula(){
    const navigate= useNavigate();

    return(
        <main>
            <button onClick={()=> navigate("../")}>Ir a inicio</button>
            <GrupoCursos/>
        </main>
    );
}