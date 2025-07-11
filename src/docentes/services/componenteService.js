import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;

export const componenteService = {

    // Obtener todos los componentes de un curso
    getComponentes: async (cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/cursocomponente/curso/${cursoId}`);
        return data;
    },

    // Obtener todos los hijos de un componente
    getHijos: async (componenteId) => {
        const { data } = await axios.get(`${baseUrl}api/cursocomponente/padre/${componenteId}`);
        return data;
    },

    // Obtener hojas de curso
    getHojas: async (cursoId) => {
        const { data } = await axios.get(`${baseUrl}api/cursocomponente/curso/${cursoId}/hojas`);
        return data;
    },


    
    

}
