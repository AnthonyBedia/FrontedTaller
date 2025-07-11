
export async function getArbolCompetencia(competenciaId) {
  const token = localStorage.getItem("token");
  const resp = await fetch(`https://modeval-ejc7cfajc2hqgkfb.canadacentral-01.azurewebsites.net/api/competencias/${competenciaId}/arbol-componentes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error("Error al obtener el árbol");
  return await resp.json();
}