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
      <Route path="/registro" element={<Registro />} />

      <Route path="/" element={<AlumnoLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<AlumnoDashboard />} />
        <Route path="calificaciones" element={<Calificaciones />} />
        <Route path="miscursos" element={<MisCursos />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
