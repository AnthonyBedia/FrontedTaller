import { Navigate, Route, Routes } from 'react-router-dom';
import { CursosHome } from '../pages';
import { CursosResumen, CursosCopiar } from '../views';

export const CursosRoutes = () => {
  return (
    <Routes>
        {
          //< Route path="/" element={ <Navigate to="/auth/login" />}  />
        }

        < Route path="resumen" element={ <CursosHome vista="resumen" />} />
        < Route path="copiar" element={ <CursosHome vista="copiar" />} />
        < Route path="nuevo" element={ <CursosHome vista="nuevo" />} />

    </Routes>
  )
}
