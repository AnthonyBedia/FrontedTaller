import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;

export const grupoService = {

    // Obtener todos los grupos de un curso
    getGrupos: async (cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/grupos/curso/${cursoId}`);
        return data;
    },

    // Obtener grupos por alumno y curso
    getGruposByAlumnoIdAndCursoId: async (alumnoIds, cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/grupos/alumnos/${cursoId}`, {
            params: { alumnoIds: alumnoIds }
        });
        return data;
    },

    // Obtener grupo de un alumno específico
    getGrupoByAlumnoIdAndCursoId: async (alumnoId, cursoId) => {
        try {
            const { data } = await axios.get(`${baseUrl}api/grupos/alumnos/${cursoId}`, {
                params: { alumnoIds: [alumnoId] }
            });
            // Retornar el primer (y único) elemento del array
            return Array.isArray(data) && data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error('Error obteniendo grupo individual:', error);
            return null;
        }
    },

    // Obtener grupos por IDs de grupo
    getGruposByGrupoIds: async (grupoIds) => {
        const { data } = await axios.get(`${baseUrl}api/grupos/grupos/${grupoIds}`, {
            params: { grupoIds: grupoIds }
        });
        return data;
    },

    // Buscar cursos por nombre
    buscarCursos: async (parteNombre) => {
        const { data } = await axios.get(`${baseUrl}api/grupos/buscarcurso/${parteNombre}`);
        return data;
    },

    // Vaciar grupo 
    vaciarGrupo: async (grupoId, cursoId) => {
        const { data } = await axios.post(`${baseUrl}api/grupos/vaciargrupo?grupoId=${grupoId}&cursoId=${cursoId}`);
        
        return data;
    },

    // Agregar alumnos a un grupo
    agregarAlumnosAGrupo: async (alumnocursoIds, grupoId) => {
        const { data } = await axios.post(`${baseUrl}api/grupos/agregaralumnos`, null, {
            params: { 
                alumnocursoIds: alumnocursoIds,
                grupoId: grupoId 
            }
        });
        return data;
    },

    // Obtener grupo por código y curso
    getGrupoByCodigoAndCursoId: async (codigo, cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/grupos/grupos/${codigo}/${cursoId}`);
        return data;
    }



};