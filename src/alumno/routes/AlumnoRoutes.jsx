import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginAlumno } from '../components/LoginAlumno';
import { AlumnoLayout } from '../layout/AlumnoLayout';
import { AlumnoDashboard } from '../pages/AlumnoDashboard';
import { Calificaciones } from '../pages/Calificaciones';
import { MisCursos } from '../pages/MisCursos';
import { Registro } from '../pages/Registro';
import { Personalizacion } from '../pages/Personalizacion';

export const AlumnoRoutes = () => {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/login" element={<LoginAlumno />} />
      <Route path="/registro" element={<Registro />} />
      
      {/* Rutas privadas con layout */}
      <Route path="/" element={<AlumnoLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<AlumnoDashboard />} />
        <Route path="calificaciones" element={<Calificaciones />} />
        <Route path="miscursos" element={<MisCursos />} />
        {/* Agregar estas rutas para que funcionen los enlaces del dashboard */}
        <Route path="horarios" element={<div>Página de Horarios - En desarrollo</div>} />
        <Route path="perfil" element={<div>Página de Perfil - En desarrollo</div>} />
        
        <Route path="personalizar" element={<Personalizacion />} />
        <Route path="" element={<Navigate to="/alumno/personalizar" />} />
      </Route>
      
      {/* Redirección catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};