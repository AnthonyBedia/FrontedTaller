import { Route, Routes, useLocation } from "react-router-dom";
import AsociarComponentesPage from "../pages/AsociarComponentesPage";
import { CompetenciasPage } from "../pages/CompetenciasPage";
import Formulas from "../pages/formulas";
import AsignarFormula from "../pages/asignarformula";
import MainEval from "../pages/evalHome";

export const EvaluacionesRoutes = () => {
  const location = useLocation();

  console.log("EvaluacionesRoutes - Ruta actual:", location.pathname);

  return (
    <Routes>
      <Route path="componente" element={<AsociarComponentesPage />} />
      <Route path="competencias" element={<CompetenciasPage />} />
      <Route path='formulas' element={<Formulas/>}/>
      <Route path="asignarformula" element={<AsignarFormula/>}/>
      <Route path="/" element={<MainEval/>}/>
    </Routes>
  );
};
