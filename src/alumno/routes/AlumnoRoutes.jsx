import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginAlumno } from '../components/LoginAlumno';
import { AlumnoLayout } from '../layout/AlumnoLayout';
import { AlumnoDashboard } from '../pages/AlumnoDashboard';
import { Calificaciones } from '../pages/Calificaciones';
import { MisCursos } from '../pages/MisCursos';


import { Registro } from '../pages/Registro';


export const AlumnoRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginAlumno />} />
      
      {/* Rutas protegidas con layout */}
      <Route path="/" element={<AlumnoLayout />}>
        <Route path="dashboard" element={<AlumnoDashboard />} />
        <Route path="" element={<Navigate to="/alumno/dashboard" />} />

        <Route path="Calificaciones" element={<Calificaciones />} />
        <Route path="" element={<Navigate to="/alumno/Calificaciones" />} />

        <Route path="MisCursos" element={<MisCursos />} />
        <Route path="" element={<Navigate to="/alumno/MisCursos" />} />
      </Route>

      
        <Route path="Registro" element={<Registro />} />
        <Route path="" element={<Navigate to="/alumno/Registro" />} />
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/alumno/login" />} />
    </Routes>
  );
};