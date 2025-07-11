import React from "react";
import { useNavigate } from "react-router-dom";
import GrupoComponente from "./sections/grupoComponente";

export default function ComponentePage() {
    const navigate = useNavigate();

    return(
            <main>
                <button onClick={()=> navigate("../")}>Ir a inicio</button>
                <GrupoComponente/>
            </main>
        );
}
