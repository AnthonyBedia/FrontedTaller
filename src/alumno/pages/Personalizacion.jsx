import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useOutletContext } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import './PersonalizacionModel.css';

export const Personalizacion = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Verificar si useOutletContext está disponible
  let setTema;
  try {
    const context = useOutletContext();
    setTema = context?.setTema;
  } catch (error) {
    console.warn('useOutletContext no disponible:', error);
    setTema = () => {}; // función vacía como fallback
  }

  // Obtener datos del usuario desde cookies (igual que en Calificaciones)
  const cookieUser = Cookies.get('user');
  const userData = cookieUser ? JSON.parse(cookieUser) : null;

  // Estados con valores por defecto más seguros
  const [tema, setTemaLocal] = useState(() => {
    try {
      const preferencias = JSON.parse(localStorage.getItem('preferencias'));
      return preferencias?.tema_visualizacion || 'claro';
    } catch (error) {
      console.warn('Error al leer preferencias:', error);
      return 'claro';
    }
  });

  const [tamanioFuente, setTamanioFuente] = useState(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('preferencias')) || {};
      return prefs.tamanio_fuente || 'mediano';
    } catch (error) {
      return 'mediano';
    }
  });

  const [tipoFuente, setTipoFuente] = useState(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('preferencias')) || {};
      return prefs.tipo_fuente || 'serif';
    } catch (error) {
      return 'serif';
    }
  });

  const [mostrarCodigoCurso, setMostrarCodigoCurso] = useState(true);
  const [mostrarNombreDocente, setMostrarNombreDocente] = useState(true);
  const [mostrarIdCurso, setMostrarIdCurso] = useState(true);
  const [seccionInicio, setSeccionInicio] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Cargar preferencias al montar el componente
  useEffect(() => {
    const cargarPreferencias = async () => {
      if (!userData?.id) return;

      try {
        const response = await fetch(`http://localhost:8080/api-alumno/v1/personalizacion/${userData.id}`);
        if (response.ok) {
          const preferencias = await response.json();
          setTemaLocal(preferencias.tema_visualizacion || 'claro');
          setTamanioFuente(preferencias.tamanio_fuente || 'mediano');
          setTipoFuente(preferencias.tipo_fuente || 'serif');
          setMostrarCodigoCurso(preferencias.mostrar_codigo_curso ?? true);
          setMostrarNombreDocente(preferencias.mostrar_docente_curso ?? true);
          setMostrarIdCurso(preferencias.mostrar_id_curso ?? true);
          setSeccionInicio(preferencias.seccion_inicio || 'dashboard');
        }
      } catch (error) {
        console.error('Error al cargar preferencias:', error);
      }
    };

    cargarPreferencias();
  }, [userData?.id]);

  // Aplicar estilos de fuente
  useEffect(() => {
    try {
      const preferencias = JSON.parse(localStorage.getItem('preferencias')) || {};
      preferencias.tipo_fuente = tipoFuente;
      preferencias.tamanio_fuente = tamanioFuente;
      localStorage.setItem('preferencias', JSON.stringify(preferencias));

      document.body.style.fontFamily = obtenerFuente(tipoFuente);
      document.body.style.fontSize = obtenerTamanio(tamanioFuente);
    } catch (error) {
      console.error('Error al aplicar estilos de fuente:', error);
    }
  }, [tipoFuente, tamanioFuente]);

  const handleGuardar = async () => {
    if (!userData?.id) {
      alert('No se pudo obtener la información del usuario');
      return;
    }

    setLoading(true);
    
    const preferencias = {
      tema_visualizacion: tema,
      tamanio_fuente: tamanioFuente,
      tipo_fuente: tipoFuente,
      mostrar_codigo_curso: mostrarCodigoCurso,
      mostrar_docente_curso: mostrarNombreDocente,
      mostrar_id_curso: mostrarIdCurso,
      seccion_inicio: seccionInicio,
    };

    try {
      const response = await fetch(`http://localhost:8080/api-alumno/v1/personalizacion/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencias),
      });

      if (!response.ok) {
        throw new Error('Error al guardar preferencias');
      }

      const data = await response.json();
      alert('Preferencias guardadas correctamente');
      localStorage.setItem('preferencias', JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      alert('Hubo un error al guardar tus preferencias.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemaChange = (e) => {
    const nuevoTema = e.target.value;
    setTemaLocal(nuevoTema);
    
    // Solo llamar setTema si está disponible
    if (setTema) {
      setTema(nuevoTema);
    }

    try {
      const preferencias = JSON.parse(localStorage.getItem('preferencias')) || {};
      preferencias.tema_visualizacion = nuevoTema;
      localStorage.setItem('preferencias', JSON.stringify(preferencias));
    } catch (error) {
      console.error('Error al guardar tema:', error);
    }
  };

  const obtenerFuente = (tipo) => {
    switch (tipo) {
      case 'inter': return 'Inter, sans-serif';
      case 'serif': return 'Georgia, serif';
      case 'monoespaciado': return '"Courier Prime", monospace';
      default: return 'sans-serif';
    }
  };

  const obtenerTamanio = (tam) => {
    switch (tam) {
      case 'pequeno': return '13px';
      case 'mediano': return '16px';
      case 'grande': return '19px';
      default: return '16px';
    }
  };

  // Mostrar mensaje si no hay usuario
  if (!userData) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button onClick={() => navigate('../dashboard')} className="back-btn">
            ← Volver al Dashboard
          </button>
          <h1>Personalización</h1>
        </div>
        <p style={{ padding: '2rem' }}>No se pudo cargar la información del usuario.</p>
      </div>
    );
  }

  return (
    <Box className="contenedor-personalizacion"
      sx={{
        backgroundColor: theme.palette.background.default,
      }}>
      <button onClick={() => navigate('../dashboard')} className="back-btn">
        ← Volver al Dashboard
      </button>
      <Typography variant="h5" gutterBottom>
        Personalización del Usuario
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{
            backgroundColor: theme.palette.background.paper
          }}>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tema de visualización</FormLabel>
                <RadioGroup
                  value={tema}
                  onChange={handleTemaChange}
                >
                  <FormControlLabel value="claro" control={<Radio />} label="Modo claro" />
                  <FormControlLabel value="oscuro" control={<Radio />} label="Modo oscuro" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Formato del texto</Typography>
              <Box>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Tamaño de fuente</FormLabel>
                  <RadioGroup
                    value={tamanioFuente}
                    onChange={(e) => setTamanioFuente(e.target.value)}
                    row
                  >
                    <FormControlLabel value="pequeno" control={<Radio />} label="Pequeño" />
                    <FormControlLabel value="mediano" control={<Radio />} label="Mediano" />
                    <FormControlLabel value="grande" control={<Radio />} label="Grande" />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend">Tipo de fuente</FormLabel>
                  <RadioGroup
                    value={tipoFuente}
                    onChange={(e) => setTipoFuente(e.target.value)}
                    row
                  >
                    <FormControlLabel value="inter" control={<Radio />} label="Inter" />
                    <FormControlLabel value="serif" control={<Radio />} label="Serif" />
                    <FormControlLabel value="monoespaciado" control={<Radio />} label="Monoespaciado" />
                  </RadioGroup>
                </FormControl>

                <Paper className="vista-previa-fuente" elevation={1}>
                  Ejemplo de fuente personalizada
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Visualización de información de cursos</Typography>
              <FormControlLabel
                control={<Checkbox checked={mostrarCodigoCurso} onChange={() => setMostrarCodigoCurso(!mostrarCodigoCurso)} />}
                label="Visualizar código de curso"
              />
              <FormControlLabel
                control={<Checkbox checked={mostrarNombreDocente} onChange={() => setMostrarNombreDocente(!mostrarNombreDocente)} />}
                label="Visualizar nombre de docente"
              />
              <FormControlLabel
                control={<Checkbox checked={mostrarIdCurso} onChange={() => setMostrarIdCurso(!mostrarIdCurso)} />}
                label="Visualizar ID del curso"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Sección de inicio personalizada</Typography>
              <RadioGroup
                value={seccionInicio}
                onChange={(e) => setSeccionInicio(e.target.value)}
              >
                <FormControlLabel value="dashboard" control={<Radio />} label="Dashboard general" />
                <FormControlLabel value="cursos" control={<Radio />} label="Mis cursos" />
                <FormControlLabel value="notas" control={<Radio />} label="Calificaciones" />
                <FormControlLabel value="horarios" control={<Radio />} label="Horarios" />
                <FormControlLabel value="perfil" control={<Radio />} label="Perfil" />
                <FormControlLabel value="competencias" control={<Radio />} label="Competencias por curso" />
              </RadioGroup>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="botones-accion">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button 
          variant="outlined" 
          color="error"
          onClick={() => navigate('../dashboard')}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default Personalizacion;
