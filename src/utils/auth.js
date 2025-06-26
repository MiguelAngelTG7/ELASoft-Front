export function guardarToken(token) {
  localStorage.setItem("access", token);
}

export function obtenerToken() {
  return localStorage.getItem("access");
}

export function eliminarToken() {
  localStorage.removeItem("access");
}
