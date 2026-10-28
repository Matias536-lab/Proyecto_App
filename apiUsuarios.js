// Conexion de la app con la API de usuarios.
//
// IMPORTANTE: poner aca la direccion IPv4 de la notebook.
// Se consigue con el comando ipconfig, en la linea "Direccion IPv4".
// No sirve localhost: para el celular, localhost es el celular.
const IP_DE_LA_NOTEBOOK = "10.0.2.36";

const PUERTO = 3000;
const BASE = "http://" + IP_DE_LA_NOTEBOOK + ":" + PUERTO;

// Si la IP esta mal o el servidor no esta levantado, fetch se queda esperando
// mucho tiempo. Esto corta a los 8 segundos con un mensaje entendible.
function conTiempoLimite(promesa, segundos) {
  const limite = new Promise(function (_, rechazar) {
    setTimeout(function () {
      rechazar(new Error("No se pudo conectar con el servidor."));
    }, segundos * 1000);
  });
  return Promise.race([promesa, limite]);
}

async function pedir(ruta, opciones) {
  let respuesta;

  try {
    respuesta = await conTiempoLimite(fetch(BASE + ruta, opciones), 8);
  } catch (e) {
    throw new Error(
      "No se pudo conectar con el servidor. Revisa que este levantado y que la IP sea la correcta.",
    );
  }

  const datos = await respuesta.json();

  // La API avisa los problemas con el campo "error".
  if (!respuesta.ok) {
    throw new Error(datos.error || "Ocurrio un error inesperado.");
  }

  return datos;
}

export function registrarUsuario(nombre, email, contrasena) {
  return pedir("/registro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: nombre,
      email: email,
      contrasena: contrasena,
    }),
  });
}

export function loguearUsuario(email, contrasena) {
  return pedir("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, contrasena: contrasena }),
  });
}

export function traerPerfil(id) {
  return pedir("/usuarios/" + id, { method: "GET" });
}

export function traerRecetasDeUsuario(id) {
  return pedir("/usuarios/" + id + "/recetas", { method: "GET" });
}

export function traerFavoritosDeUsuario(id) {
  return pedir("/usuarios/" + id + "/favoritos", { method: "GET" });
}

export function traerRecetaCompleta(id) {
  return pedir("/recetas/" + id, { method: "GET" });
}

export function crearReceta(datos) {
  return pedir("/recetas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function borrarReceta(id) {
  return pedir("/recetas/" + id, { method: "DELETE" });
}

export function importarReceta(datos) {
  return pedir("/recetas/importar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function consultarFavorito(usuarioId, recetaId) {
  return pedir("/favoritos/" + usuarioId + "/" + recetaId, { method: "GET" });
}

export function marcarFavorito(usuarioId, recetaId) {
  return pedir("/favoritos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuarioId, receta_id: recetaId }),
  });
}

export function quitarFavorito(usuarioId, recetaId) {
  return pedir("/favoritos/" + usuarioId + "/" + recetaId, {
    method: "DELETE",
  });
}

// Devuelve el id que la receta tiene en MySQL. Si la receta nacio en la app
// ya lo tiene; si vino de recetas.js o de TheMealDB, la importa primero.
export async function asegurarRecetaEnBase(receta, usuarioId) {
  if (receta.origen === "bdd") return receta.id;

  const resultado = await importarReceta({
    autor_id: usuarioId,
    origen: receta.origen || "local",
    origen_id: String(receta.id),
    nombre: receta.nombre,
    categoria: receta.categoria,
    tiempo: receta.tiempo,
    porciones: receta.porciones,
    descripcion: receta.descripcion,
    imagen: receta.imagen,
    ingredientes: receta.ingredientes || [],
    pasos: receta.pasos || [],
  });

  return resultado.id;
}

export function probarConexion() {
  return pedir("/ping", { method: "GET" });
}
