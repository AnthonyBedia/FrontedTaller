import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../../seguridad/slices/authSlice';

export const DashboardLayout = () => {
  const user = useSelector(state => state.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState('docente');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const menus = [
    {// dashboard/
      id: 'docente',
      title: '👩‍🏫 Módulo Docente',
      items: [
        { id: 'gestion-alumnos', label: 'Gestión de Alumnos' },
        { id: 'carga-masiva', label: 'Carga Masiva de Alumnos' },
        { id: 'creacion-cursos', label: 'Creación de Cursos' },
        { id: 'aprobacion-solicitudes', label: 'Aprobación de Solicitudes' },
        { id: 'grupos-curso', label: 'Grupos de Curso' },
        { id: 'registro-notas', label: 'Registro de Notas' },
        { id: 'notificaciones', label: 'Notificaciones a Alumnos' },
        { id: 'dashboard-curso', label: 'Dashboard del Curso' }
      ]
    },
    {
      id: 'evaluaciones',
      title: '📊 Evaluaciones',
      items: [
        { id: 'componente', label: 'Componentes y Pesos' },
        { id: 'formulas', label: 'Fórmulas de Evaluación' },
        { id: 'crearrubrica', label: 'Crear rúbricas' },
        { id: 'visualizarrubrica', label: 'Ver rúbricas' },
        { id: 'arboldashboard', label: 'Árbol de componentes' }
      ]
    },
    {
      id: 'silabos',
      title: '📄 Sílabos',
      items: [
        { id: 'registro-silabos', label: 'Registro de Sílabos' },
        { id: 'unidades-aprendizaje', label: 'Unidades de Aprendizaje' },
        { id: 'subir-silabo', label: 'Subir Sílabo (.docx / .pdf)' },
        { id: 'validacion-recomendaciones', label: 'Validación y Recomendaciones' },
        { id: 'generar-pdf', label: 'Generar PDF de Sílabo' }
      ]
    }
  ];

  const toggleMenu = (menuId) => {
    setExpandedMenu(prev => (prev === menuId ? null : menuId));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Menú lateral */}
      <div style={{ width: '270px', backgroundColor: '#2c3e50', color: 'white', padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#ecf0f1' }}>Menú</h2>
        </div>

        {menus.map(menu => (
          <div key={menu.id}>
            <div
              onClick={() => toggleMenu(menu.id)}
              style={{
                padding: '12px 20px',
                fontWeight: 'bold',
                backgroundColor: expandedMenu === menu.id ? '#34495e' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              {menu.title}
            </div>

            {expandedMenu === menu.id && (
              <div>
                {menu.items.map(item => {
                  // Mapear las rutas correctas según el módulo
                  const getRoute = (menuId, itemId) => {
                    switch (menuId) {
                      case 'docente':
                        return `/docentes/${itemId}`;
                      case 'evaluaciones':
                        return `/evaluaciones/${itemId}`;
                      case 'silabos':
                        return `/silabos/${itemId}`;
                      default:
                        return `/dashboard/${menuId}/${itemId}`;
                    }
                  };

                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate(getRoute(menu.id, item.id))}
                      style={{
                        padding: '10px 30px',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        borderLeft: '4px solid transparent',
                        transition: 'all 0.3s',
                        fontSize: '0.95rem'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#3d566e';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Área principal */}
      <div style={{ flex: 1, backgroundColor: '#ecf0f1' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px 30px',
          borderBottom: '1px solid #bdc3c7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.8rem' }}>
            Dashboard Principal
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#7f8c8d' }}>
              👤 {user?.email || 'Docente'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido dinámico según ruta */}
        <div style={{ padding: '30px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
