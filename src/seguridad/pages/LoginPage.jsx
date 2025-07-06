import { useDispatch } from 'react-redux';
import { login } from '../slices';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch(login({
      uid: 'test123',
      email: 'test@correo.com',
      displayName: 'Usuario Test',
      photoURL: ''
    }));

    // Redirige manualmente
    navigate('/cursos/resumen');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Página de Login</h2>
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
};