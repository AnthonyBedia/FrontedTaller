import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;

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

    // Verificar si un alumno está en un curso
    verificarAlumnoEnCurso: async (alumnocursoId, cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/alumnos/in-curso/${alumnocursoId}/${cursoId}`);
        return data;
    },

}; 