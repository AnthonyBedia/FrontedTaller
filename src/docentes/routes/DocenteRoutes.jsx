import { Routes, Route, Navigate } from 'react-router-dom';
import GestionAlumnos from '../pages/GestionAlumnos';
import CargaMasiva from '../pages/CargaMasiva';
import CreacionCursos from '../pages/CreacionCursos';
import { DashboardLayout } from '../../general/layouts/DashboardLayout';
import GruposCurso from '../pages/GruposCurso';
import RegistroNotas from '../pages/RegistroNotas';
//import { CursoProvider } from '../components/CursoContext';


export const DocenteRoutes = () => {
  return (
    //<CursoProvider>
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="" element={<Navigate to="gestion-alumnos" replace />} />
        <Route path="gestion-alumnos" element={<GestionAlumnos />} />
        <Route path="carga-masiva" element={<CargaMasiva />} />
        <Route path="creacion-cursos" element={<CreacionCursos />} />
        <Route path="grupos-curso" element={<GruposCurso />} />
        <Route path="registro-notas" element={<RegistroNotas />} />
      </Route>
    </Routes>
    //</CursoProvider>
  );
};
