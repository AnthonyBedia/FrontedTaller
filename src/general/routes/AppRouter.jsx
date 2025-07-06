import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthRoutes } from '../../seguridad/routes/AuthRoutes'
import { CursosRoutes } from '../../cursos/routes/CursosRoutes'
import { EvaluacionesRoutes } from "../../evaluaciones/routes/EvaluacionesRoutes";

import { CheckingAuth } from '../../seguridad/components';
import { useCheckAuth } from '../../seguridad/hooks';

export const AppRouter = () => {

  const status = useCheckAuth();

  if ( status === 'checking' ) {
    return <CheckingAuth />
  }

  return (
    <Routes>
        {
          (status === 'authenticated') 
           ? 
           <>
            <Route path="/cursos/*" element={ <CursosRoutes /> } />
            <Route path="/evaluaciones/*" element={<EvaluacionesRoutes />} />
           </>
            : <Route path="/auth/*" element={ <AuthRoutes /> } />
        }
        
      <Route path="*" element={
        <Navigate to={status === 'authenticated' ? "/cursos/resumen" : "/auth/login"} />
      } />
  </Routes>
  )
}
