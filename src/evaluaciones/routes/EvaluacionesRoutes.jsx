import { Route, Routes, useLocation } from "react-router-dom";
import AsociarComponentesPage from 
"../pages/componente-competencia/componente/AsociarComponentesPage";
import { CompetenciasPage } from 
"../pages/componente-competencia/componente/CompetenciasPage";
import Formulas from "../pages/formulas";
import AsignarFormula from "../pages/asignarformula";
import ComponentePage from "../pages/grupocomponente"; 
import CrearRubrica from "../pages/crearrubrica"
import VerRubrica from "../pages/verrubrica"
import ArbolCompetenciaPage from "../pages/arboldashboard";

import MainEval from "../pages/EvalHome";

export const EvaluacionesRoutes = () => {
  const location = useLocation();

  console.log("EvaluacionesRoutes - Ruta actual:", location.pathname);

  return (
    <Routes>
      <Route path="componente" element={<AsociarComponentesPage />} />
      <Route path="competencias" element={<CompetenciasPage />} />
      <Route path='formulas' element={<Formulas/>}/>
      <Route path="asignarformula" element={<AsignarFormula/>}/>
      <Route path="componentes" element={<ComponentePage />} /> 
      <Route path="/" element={<MainEval/>}/>
      <Route path="crearrubrica" element={<CrearRubrica/>}/>
      <Route path="/visualizarrubrica" element={<VerRubrica/>}/>
      <Route path="arboldashboard" element={<ArbolCompetenciaPage />} />
    </Routes>
  );
};
