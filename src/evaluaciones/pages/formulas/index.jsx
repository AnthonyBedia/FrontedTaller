import React from "react";
import GrupoFormulas from "./sections/GrupoFormulas";
import { useNavigate } from "react-router-dom";

export default function Formulas(){
    const navigate= useNavigate();

    return(
        <main>
            <button onClick={()=> navigate("../")}>Ir a inicio</button>
            <GrupoFormulas/>
        </main>
    );
}