import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;

export const notaService = {
    // Obtener nota especifica de un alumno
    getNotaEspecifica: async (alumnoId, cursoId, componenteNotaId) => {
        const { data } = await axios.get(`${baseUrl}api/alumno-notas/alumno/${alumnoId}/curso/${cursoId}/componente/${componenteNotaId}`);
        return data;
    },

    
}