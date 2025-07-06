import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { login } from '../slices';

export const useCheckAuth = () => {
  const { status } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const isInAuth = location.pathname.startsWith('/auth');

    // Solo simula login automático si está en 'checking' y fuera de /auth
    if (!isInAuth && status === 'checking') {
      setTimeout(() => {
        const uid = 'xyz12345';
        const email = 'hcorderos@unmsm.edu.pe';
        const displayName = 'Hugo R. Cordero';
        const photoURL = '';

        dispatch(login({ uid, email, displayName, photoURL }));
      }, 500);
    }
  }, [location.pathname, status, dispatch]);

  return status;
};