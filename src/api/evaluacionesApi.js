export async function obtenerToken(credentials) {
  const response = await fetch("http://localhost:8080/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error("Error al iniciar sesión");

  const data = await response.json();
  localStorage.setItem("token", data.token);
  return data.token;
}