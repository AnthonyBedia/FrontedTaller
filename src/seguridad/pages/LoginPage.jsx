import { useDispatch } from 'react-redux';
import { login, checkingCredentials } from '../slices';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './LoginPage.css';

// Importar la variable de entorno para la URL del backend
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL || 'https://docente-b5dbhwfgfdb9dwh3.canadacentral-01.azurewebsites.net';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [applyBlur, setApplyBlur] = useState(false);
  const registerRef = useRef(null);

  // Estados para el formulario de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [toastMessages, setToastMessages] = useState([]);

  const handleCloseToast = (indexToRemove) => {
    setToastMessages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const showCustomToast = (message) => {
    setToastMessages(prev => [...prev, message]);
  };

  const toastContainerRef = useRef(null);

  // Formulario registro
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [institucionId, setInstitucionId] = useState('');
  const [departamentoId, setDepartamentoId] = useState('');
  const [claseId, setClaseId] = useState('');

  const [categorias, setCategorias] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [clases, setClases] = useState([]);

  const handleOpenRegister = () => {
    setShowRegister(true);
    setApplyBlur(true);
  };

  const handleCloseRegister = () => {
    setApplyBlur(false);
    setIsClosing(true);
    setTimeout(() => {
      setShowRegister(false);
      setIsClosing(false);
    }, 350);
  };

  // Función para manejar el login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setToastMessages([]); // Limpiar mensajes previos

    // Validaciones básicas
    if (!loginEmail || !loginPassword) {
      showCustomToast("❌ Por favor, completa todos los campos");
      setLoginLoading(false);
      return;
    }

    try {
      const response = await fetch(BACKEND_URL + "api/usuarios/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const result = await response.text();

      if (response.ok) {
        showCustomToast("✅ " + result);
        dispatch(checkingCredentials());
        setTimeout(() => {
          dispatch(login({ 
            uid: 'manual_login_' + Date.now(),
            email: loginEmail,
            displayName: loginEmail.split('@')[0],
            photoURL: null
          }));
          navigate('/principal/dashboard');
        }, 200);
      } else {
        showCustomToast("❌ " + result);
      }
    } catch (error) {
      console.error("Error en el login:", error);
      showCustomToast("❌ Hubo un error al iniciar sesión. Verifica tu conexión.");
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showRegister &&
        registerRef.current &&
        !registerRef.current.contains(e.target) &&
        (!toastContainerRef.current || !toastContainerRef.current.contains(e.target))
      ) {
        handleCloseRegister();
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRegister]);

  useEffect(() => {
    fetch(BACKEND_URL + "api/categorias").then(res => res.json()).then(setCategorias);
    fetch(BACKEND_URL + "api/instituciones").then(res => res.json()).then(setInstituciones);
    fetch(BACKEND_URL + "api/departamentos").then(res => res.json()).then(setDepartamentos);
    fetch(BACKEND_URL + "api/clases").then(res => res.json()).then(setClases);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastMessages([]); // Limpiar errores previos

    const errores = [];

    if (!email.endsWith("@unmsm.edu.pe")) {
      errores.push("❌ El correo debe terminar en @unmsm.edu.pe");
    }
    if (password !== confirmPassword) {
      errores.push("❌ Las contraseñas no coinciden");
    }

    if (errores.length > 0) {
      errores.forEach(showCustomToast);
      return;
    }

    const data = {
      nombres,
      apellidos,
      codigo,
      email,
      password,
      confirmPassword,
      claseId,
      categoriaId,
      institucionId: parseInt(institucionId),
      departamentoId: parseInt(departamentoId)
    };

    try {
      const response = await fetch(BACKEND_URL + "/api/docentes/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.text();

      try {
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed)) {
          parsed.forEach(msg => showCustomToast("❌ " + msg));
        } else if (typeof parsed === 'string') {
          showCustomToast("❌ " + parsed);
        } else {
          showCustomToast("❌ Error desconocido");
        }
      } catch (err) {
        if (result === "Registro exitoso") {
          showCustomToast("✅ Registro exitoso");
          handleCloseRegister();
        } else {
          showCustomToast("❌ " + result);
        }
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      showCustomToast("❌ Hubo un error al registrar.");
    }
  };

  return (
    <div className="login-container">
      <style>
        {`
          .blob-container {
            position: absolute;
            inset: 0;
            overflow: hidden;
            z-index: -1;
          }
          
          .blob {
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            opacity: 0.5;
            filter: blur(100px);
            mix-blend-mode: screen;
            animation: floatBlob 20s ease-in-out infinite alternate;
          }
          
          .blob.blue {
            background: #142B6B;
            top: -100px;
            left: -150px;
            animation-delay: 0s;
          }
          
          .blob.indigo {
            background: #2b4a99;
            bottom: -150px;
            left: 40%;
            animation-delay: 4s;
          }
          
          .blob.navy {
            background: #000C4F;
            top: 20%;
            right: -100px;
            animation-delay: 8s;
          }
          
          @keyframes floatBlob {
            0%   { transform: translate(0, 0) scale(1); }
            50%  { transform: translate(30px, -40px) scale(1.1); }
            100% { transform: translate(-20px, 30px) scale(1); }
          }

          .login-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 0;
            background: radial-gradient(circle at 50% 50%, #142B6B, #0a1f44, #000C4F);
            background-size: 600% 600%;
            animation: mixFlow 5s ease-in-out infinite;
            transition: filter 0.4s ease, opacity 0.4s ease;
          }

          @keyframes mixFlow {
            0%   { background-position: 0% 0%; }
            25%  { background-position: 100% 50%; }
            50%  { background-position: 50% 100%; }
            75%  { background-position: 0% 50%; }
            100% { background-position: 0% 0%; }
          }

          .login-box {
            background-color: white;
            padding: 2rem;
            border-radius: 12px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
          }

          .logo {
            width: 300px;
            margin-bottom: 0.5rem;
          }

          h2 {
            color: #0D2D73;
            margin-bottom: 1.5rem;
          }

          .input-group {
            display: flex;
            align-items: stretch;
            background-color: #e5e5e5;
            border-radius: 15px;
            margin-bottom: 1rem;
            box-shadow: 2px 2px 6px rgba(0,0,0,0.15);
            overflow: hidden;
          }

          input {
            flex: 1;
            border: none;
            background: none;
            outline: none;
            font-size: 1rem;
            color: #333;
            padding: 0 0.8rem;
          }

          .login-button {
            background-color: #142B6B;
            color: white;
            border: none;
            padding: 0.8rem 2.5rem;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0px 3px 6px rgba(0,0,0,0.2);
            margin-top: 1rem;
          }

          .login-button:hover {
            background-color: #113a8a;
          }

          .register-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: 45vw;
            height: 100vh;
            display: flex;
            z-index: 1000;
            background: white;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.5s ease-out forwards;
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            overflow: hidden; 
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0%);
            }
          }

          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(20, 43, 107, 0.3);
            z-index: 10;
          }

          .toast-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            z-index: 9999;
          }

          .custom-toast {
            background-color: #fff0f0;
            color: #d00000;
            padding: 12px 20px;
            border: 1px solid #d00000;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: fadeIn 0.3s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div className={`login-page ${applyBlur ? 'apply-blur' : ''}`}>
        <h2 className="title">¡Bienvenido!</h2>
        <div className="login-box">
          <div className="logo-container">
            <img src="/images/v98_36.png" alt="Logo UNMSM" className="logo" />
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <div className="icon-wrapper">
                <img src="/images/v98_31.png" alt="Icono usuario" className="input-icon" />
              </div>
              <input 
                type="email" 
                placeholder="Correo institucional"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={loginLoading}
              />
            </div>
            <div className="input-group">
              <div className="icon-wrapper">
                <img src="/images/v98_34.png" alt="Icono contraseña" className="input-icon" />
              </div>
              <input 
                type="password" 
                placeholder="Contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={loginLoading}
              />
            </div>
            <button 
              type="submit" 
              className="login-button"
              disabled={loginLoading}
            >
              {loginLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
            <p className="register">
              ¿Nuevo Usuario?{' '}
              <button type="button" className="register-text-btn" onClick={handleOpenRegister}>
                Regístrate
              </button>
            </p>
          </form>
        </div>
      </div>

      {showRegister && <div className="overlay"></div>}

      {showRegister && (
        <div className={`register-panel ${isClosing ? 'slide-out' : ''}`} ref={registerRef}>
          <div className="register-image">
            <img src="/images/facultad.jpg" alt="Facultad UNMSM" />
          </div>
          <div className="register-content">
            <h2>Crea tu cuenta</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nombres" value={nombres} onChange={e => setNombres(e.target.value)} required />
              <input type="text" placeholder="Apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} required />
              <input type="text" placeholder="Código de docente" value={codigo} onChange={e => setCodigo(e.target.value)} required />
              <input type="email" placeholder="Correo institucional" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirmar contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

              <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>

              <select value={institucionId} onChange={e => setInstitucionId(e.target.value)} required>
                <option value="">Selecciona una institución</option>
                {instituciones.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.nombreCorto}</option>
                ))}
              </select>

              <select value={departamentoId} onChange={e => setDepartamentoId(e.target.value)} required>
                <option value="">Selecciona un departamento</option>
                {departamentos.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                ))}
              </select>

              <select value={claseId} onChange={e => setClaseId(e.target.value)} required>
                <option value="">Selecciona una clase</option>
                {clases.map(cl => (
                  <option key={cl.id} value={cl.id}>{cl.nombre}</option>
                ))}
              </select>

              <button type="submit" className="register-btn">Registrarse</button>
            </form>
            <button onClick={handleCloseRegister} className="close-btn">Cerrar</button>
          </div>
        </div>
      )}

      {toastMessages.length > 0 && (
        <div ref={toastContainerRef} className="toast-container">
          {toastMessages.map((msg, index) => (
            <div key={index} className="custom-toast">
              <span>{msg}</span>
              <button type="button" className="close-toast" onClick={() => handleCloseToast(index)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
