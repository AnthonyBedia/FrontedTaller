import axios from "axios";


const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;
const link1 = 'https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/token';
const link2 = 'https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/notas/top/';

export const alumnoService = {

    // Guardar alumnos masivamente
    guardarAlumnosMasivo: async (datosAlumnos) => {
        const { data } = await axios.post(`${baseUrl}api/alumnos/guardar-masivo`, datosAlumnos);
        return data;
    },

    // Contar total de alumnos
    contarAlumnos: async () => {
        const { data } = await axios.get(`${baseUrl}api/alumnos/contar`);
        return data;
    },

    // Contar alumnos por estado
    contarPorEstado: async (estado) => {
        const { data } = await axios.get(`${baseUrl}api/alumnos/contar-por-estado/${estado}`);
        return data;
    },

    // Listar todos los alumnos
    listarAlumnos: async () => {
        const { data } = await axios.get(`${baseUrl}api/alumnos/listar`);
        return data;
    },

    // Listar alumnos por curso
    listarAlumnosPorCurso: async (cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/alumnos/curso/${cursoId}`);
        return data;
    },

    // Buscar alumno por nombre y apellido
    buscarAlumnoPorNombreApellido: async (nombre, apellido, cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/alumnos/nombre-apellido/${nombre}/${apellido}/${cursoId}`);
        return data;
    },

    buscarAlumnoPorCodigoyCurso: async (codigo, cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/alumnos/codigo/${codigo}/${cursoId}`);
        return data;
    },

    // Verificar si un alumno está en un curso
    verificarAlumnoEnCurso: async (alumnocursoId, cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/alumnos/in-curso/${alumnocursoId}/${cursoId}`);
        return data;
    },

    TopComponenete: async () => {
    try {
        // 1. Obtener el token
        const authResponse = await axios.post(link1, {
        username: 'test@correo.com'  });

        const token = authResponse.data.token;

        // 2. Usar el token para hacer la solicitud protegida
        const datosResponse = await axios.get(`${link2} ${cursoId}/${componenteId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });

    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
    return datosResponse.data;
    },


}; 