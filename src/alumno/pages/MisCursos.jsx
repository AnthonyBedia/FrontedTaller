import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';

// Componente para una tarjeta de curso individual
const CursoCard = ({ curso }) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      borderRadius: '12px'
    }}
  >
    <Box>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
        {curso.nombre}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Código
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {curso.codigo}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        ID
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {curso.id}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Ciclo
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {curso.ciclo}
      </Typography>
    </Box>
    <Button 
      variant="contained" 
      size="medium"
      sx={{ mt: 2, alignSelf: 'flex-end' }}
    >
      Unirse al grupo
    </Button>
  </Paper>
);

export const MisCursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch('https://modcursosayudoc-e4b3fub9g5c5gda7.brazilsouth-01.azurewebsites.net/api-cur/v1/cursos' );
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();
        setCursos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const handleSolicitarCurso = () => {
    navigate('/alumno/solicitar-curso'); 
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Cursos
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleSolicitarCurso}
          size="large"
        >
          Solicitar unirse a un curso
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: 'error.light' }}>
          <Typography variant="h6" color="error.contrastText">
            Error: {error}
          </Typography>
        </Paper>
      )}

      {!loading && !error && (
        <Grid container spacing={4}>
          {cursos.length > 0 ? (
            cursos.map((curso) => (
              <Grid item xs={12} sm={6} md={4} key={curso.id}>
                <CursoCard curso={curso} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '300px',
                    justifyContent: 'center'
                    }}
                >
                    <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                        No tienes ningún curso disponible
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Solicita unirte a un curso para comenzar
                    </Typography>
                </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};
