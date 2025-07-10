import axios from "axios";

const baseUrl = "https://modcursosayudoc-e4b3fub9g5c5gda7.brazilsouth-01.azurewebsites.net/api-cur/v1/";

export const cursoService = {

  // Buscar cursos cuyo nombre comience con una parte dada (insensible a mayúsculas/minúsculas)
  buscarPorNombre: async (parte) => {
    const normalizar = (texto) =>
      texto
        .normalize("NFD") // descompone tildes
        .replace(/[\u0300-\u036f]/g, "") // elimina los diacríticos
        .toLowerCase();

    const parteNormalizada = normalizar(parte);
    const { data } = await axios.get(`${baseUrl}cursos`);

    return data.filter((curso) =>
      normalizar(curso.nombre || "").startsWith(parteNormalizada)
    );
  },

}