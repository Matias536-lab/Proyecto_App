// ============================================================
// api.js
// Capa de datos de MyKitchen.
//
// Acá vive TODA la lógica de búsqueda. Las pantallas no saben
// de dónde salen las recetas: solo llaman a estas funciones.
// Si algún día cambiamos de API, se toca SOLO este archivo
// y ninguna pantalla se entera.
//
// La app busca en DOS lugares:
//   1) RECETAS_LOCALES  -> nuestras recetas en español (recetas.js)
//   2) La API externa   -> recetas de internet, en inglés
// ============================================================

import { RECETAS_LOCALES } from "./recetas";

// ------------------------------------------------------------
// CONFIGURACIÓN
// ------------------------------------------------------------

// Cambiá esta línea para elegir de dónde traer las recetas de internet.
// Opciones: "themealdb"  (gratis, sin registro, sin límite)
//           "spoonacular" (requiere API key, 50 créditos por día)
export const PROVEEDOR = "themealdb";

// Solo hace falta si PROVEEDOR = "spoonacular".
// Sacá tu key gratis en https://spoonacular.com/food-api
const SPOONACULAR_API_KEY = "PEGA_TU_API_KEY_ACA";

// ------------------------------------------------------------
// UTILIDADES DE TEXTO
// ------------------------------------------------------------

// Saca los acentos para que "Milanesa" y "milanesá" se encuentren igual.
// Lo hacemos a mano y no con normalize() porque el motor de JavaScript
// del celular (Hermes) no siempre lo soporta.
function quitarAcentos(texto) {
  return String(texto)
    .replace(/[áàäâã]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöôõ]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n");
}

// Deja el texto listo para comparar: sin acentos, en minúscula y sin espacios de más.
function normalizar(texto) {
  if (!texto) return "";
  return quitarAcentos(String(texto).toLowerCase()).trim();
}

// Quita las etiquetas HTML que a veces vienen en las descripciones de la API.
function limpiarHTML(texto) {
  return String(texto || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ------------------------------------------------------------
// DICCIONARIO ESPAÑOL -> INGLÉS
//
// Las APIs de recetas solo entienden inglés. Como el usuario escribe
// en español, traducimos el término antes de mandarlo.
// Si una palabra no está en la lista, se manda tal cual
// (muchas funcionan igual: pizza, taco, burrito, tacos...).
// ------------------------------------------------------------
const DICCIONARIO_ES_EN = {
  // carnes
  pollo: "chicken",
  carne: "beef",
  vaca: "beef",
  cerdo: "pork",
  chancho: "pork",
  cordero: "lamb",
  pavo: "turkey",
  jamon: "ham",
  panceta: "bacon",
  salchicha: "sausage",
  chorizo: "sausage",
  milanesa: "schnitzel",
  bife: "steak",
  costilla: "ribs",
  hamburguesa: "burger",
  albondigas: "meatballs",

  // pescados
  pescado: "fish",
  atun: "tuna",
  salmon: "salmon",
  merluza: "hake",
  camaron: "shrimp",
  camarones: "shrimp",
  langostinos: "prawns",
  mariscos: "seafood",

  // vegetales
  papa: "potato",
  papas: "potatoes",
  batata: "sweet potato",
  tomate: "tomato",
  cebolla: "onion",
  ajo: "garlic",
  zanahoria: "carrot",
  lechuga: "lettuce",
  espinaca: "spinach",
  brocoli: "broccoli",
  choclo: "corn",
  maiz: "corn",
  zapallo: "pumpkin",
  calabaza: "pumpkin",
  zapallito: "zucchini",
  morron: "pepper",
  pimiento: "pepper",
  champinon: "mushroom",
  hongos: "mushroom",
  berenjena: "eggplant",
  palta: "avocado",
  arveja: "peas",
  poroto: "beans",
  lenteja: "lentils",
  lentejas: "lentils",
  garbanzo: "chickpeas",

  // básicos
  arroz: "rice",
  fideos: "pasta",
  pasta: "pasta",
  tallarines: "noodles",
  huevo: "egg",
  huevos: "eggs",
  queso: "cheese",
  leche: "milk",
  manteca: "butter",
  crema: "cream",
  pan: "bread",
  harina: "flour",
  azucar: "sugar",
  sal: "salt",
  aceite: "oil",
  avena: "oats",

  // frutas
  manzana: "apple",
  banana: "banana",
  naranja: "orange",
  limon: "lemon",
  frutilla: "strawberry",
  frutillas: "strawberries",
  durazno: "peach",
  pera: "pear",
  uva: "grape",
  anana: "pineapple",
  coco: "coconut",

  // platos y postres
  sopa: "soup",
  guiso: "stew",
  ensalada: "salad",
  tarta: "pie",
  torta: "cake",
  pastel: "cake",
  postre: "dessert",
  helado: "ice cream",
  chocolate: "chocolate",
  galletitas: "cookies",
  galletas: "cookies",
  budin: "pudding",
  panqueque: "pancake",
  panqueques: "pancakes",
  tortilla: "omelette",
  omelette: "omelette",
  empanada: "empanada",
  guisado: "stew",
  salsa: "sauce",
  pizza: "pizza",
  sandwich: "sandwich",
  tostada: "toast",
  tostadas: "toast",

  // momentos del día
  desayuno: "breakfast",
  almuerzo: "lunch",
  merienda: "snack",
  cena: "dinner",
  vegetariano: "vegetarian",
  vegano: "vegan",
};

// Traduce lo que escribió el usuario, palabra por palabra.
function traducirBusqueda(texto) {
  const limpio = normalizar(texto);
  if (!limpio) return "";

  // Primero probamos la frase completa ("ensalada cesar")
  if (DICCIONARIO_ES_EN[limpio]) {
    return DICCIONARIO_ES_EN[limpio];
  }

  // Si no, traducimos palabra por palabra
  const palabras = limpio.split(" ");
  const traducidas = palabras.map(function (palabra) {
    return DICCIONARIO_ES_EN[palabra] || palabra;
  });

  return traducidas.join(" ");
}

// ------------------------------------------------------------
// BÚSQUEDA EN NUESTRAS PROPIAS RECETAS (siempre en español)
// ------------------------------------------------------------

// Busca en el nombre, la categoría, la descripción y los ingredientes.
export function buscarLocal(texto) {
  const busqueda = normalizar(texto);
  if (!busqueda) return [];

  return RECETAS_LOCALES.filter(function (receta) {
    if (normalizar(receta.nombre).includes(busqueda)) return true;
    if (normalizar(receta.categoria).includes(busqueda)) return true;
    if (normalizar(receta.descripcion).includes(busqueda)) return true;

    // También busca dentro de la lista de ingredientes
    const ingredientes = receta.ingredientes || [];
    return ingredientes.some(function (ingrediente) {
      return normalizar(ingrediente).includes(busqueda);
    });
  });
}

// Devuelve todas las recetas de una categoría (Desayuno, Almuerzo, etc.)
export function recetasPorCategoria(categoria) {
  const buscada = normalizar(categoria);
  return RECETAS_LOCALES.filter(function (receta) {
    return normalizar(receta.categoria) === buscada;
  });
}

// ------------------------------------------------------------
// BÚSQUEDA EN INTERNET
// ------------------------------------------------------------

// Esta es la función que usan las pantallas.
// Elige sola cuál API llamar según la constante PROVEEDOR.
export async function buscarEnInternet(texto) {
  const consulta = traducirBusqueda(texto);
  if (!consulta) return [];

  if (PROVEEDOR === "spoonacular") {
    return await buscarEnSpoonacular(consulta);
  }
  return await buscarEnTheMealDB(consulta);
}

// ---------------------- TheMealDB ----------------------
// Gratis, sin registro. La clave "1" es la de prueba pública.
async function buscarEnTheMealDB(consulta) {
  const url =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" +
    encodeURIComponent(consulta);

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("No pudimos conectarnos al servidor de recetas.");
  }

  const datos = await respuesta.json();

  // Cuando no encuentra nada, TheMealDB devuelve meals: null
  if (!datos || !datos.meals) return [];

  return datos.meals.map(convertirTheMealDB);
}

// Traduce el formato de TheMealDB al formato que usa nuestra app.
// Es la parte importante: gracias a esto, una receta de internet
// se ve igual que una nuestra en todas las pantallas.
function convertirTheMealDB(plato) {
  // TheMealDB manda los ingredientes en 20 campos sueltos:
  // strIngredient1, strIngredient2... con su medida en strMeasure1, etc.
  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    const nombre = plato["strIngredient" + i];
    const medida = plato["strMeasure" + i];

    if (nombre && String(nombre).trim() !== "") {
      const linea = (
        String(medida || "").trim() +
        " " +
        String(nombre).trim()
      ).trim();
      ingredientes.push(linea);
    }
  }

  // Las instrucciones vienen en un solo texto largo, separado por saltos de línea
  const pasos = String(plato.strInstructions || "")
    .split(/\r?\n/)
    .map(function (paso) {
      return paso.trim();
    })
    .filter(function (paso) {
      return paso !== "";
    });

  return {
    id: "api-" + plato.idMeal,
    nombre: plato.strMeal,
    categoria: plato.strCategory || "De internet",
    emoji: "🌐",
    tiempo: "",
    porciones: "",
    descripcion:
      "Receta obtenida de TheMealDB. Cocina de origen: " +
      (plato.strArea || "internacional") +
      ". El texto original está en inglés.",
    ingredientes: ingredientes,
    pasos: pasos,
    imagen: plato.strMealThumb || null,
    origen: "api",
  };
}

// ---------------------- Spoonacular ----------------------
// Requiere API key. Cada búsqueda gasta créditos del plan gratuito.
async function buscarEnSpoonacular(consulta) {
  if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "PEGA_TU_API_KEY_ACA") {
    throw new Error(
      "Falta cargar la API key de Spoonacular en el archivo api.js.",
    );
  }

  const url =
    "https://api.spoonacular.com/recipes/complexSearch" +
    "?query=" +
    encodeURIComponent(consulta) +
    "&number=8" +
    "&addRecipeInformation=true" +
    "&fillIngredients=true" +
    "&apiKey=" +
    SPOONACULAR_API_KEY;

  const respuesta = await fetch(url);

  // Mensajes claros según qué salió mal
  if (respuesta.status === 401) {
    throw new Error("La API key de Spoonacular no es válida.");
  }
  if (respuesta.status === 402) {
    throw new Error(
      "Se agotaron los créditos diarios de Spoonacular. Probá de nuevo mañana.",
    );
  }
  if (!respuesta.ok) {
    throw new Error("No pudimos conectarnos a Spoonacular.");
  }

  const datos = await respuesta.json();
  const lista = datos && datos.results ? datos.results : [];

  return lista.map(convertirSpoonacular);
}

// Traduce el formato de Spoonacular al formato de nuestra app.
function convertirSpoonacular(plato) {
  // Los ingredientes pueden venir en dos campos distintos según los parámetros,
  // así que probamos uno y después el otro.
  let ingredientes = [];

  if (Array.isArray(plato.extendedIngredients)) {
    ingredientes = plato.extendedIngredients
      .map(function (ing) {
        return ing.original;
      })
      .filter(Boolean);
  } else {
    const usados = plato.usedIngredients || [];
    const faltantes = plato.missedIngredients || [];
    ingredientes = usados
      .concat(faltantes)
      .map(function (ing) {
        return ing.original;
      })
      .filter(Boolean);
  }

  // Los pasos también pueden venir de dos formas
  let pasos = [];

  if (
    Array.isArray(plato.analyzedInstructions) &&
    plato.analyzedInstructions[0] &&
    Array.isArray(plato.analyzedInstructions[0].steps)
  ) {
    pasos = plato.analyzedInstructions[0].steps.map(function (paso) {
      return paso.step;
    });
  } else if (plato.instructions) {
    pasos = limpiarHTML(plato.instructions)
      .split(". ")
      .filter(function (paso) {
        return paso.trim() !== "";
      });
  }

  const resumen = limpiarHTML(plato.summary);

  return {
    id: "api-" + plato.id,
    nombre: plato.title,
    categoria: "De internet",
    emoji: "🌐",
    tiempo: plato.readyInMinutes ? plato.readyInMinutes + " minutos" : "",
    porciones: plato.servings ? plato.servings + " porciones" : "",
    descripcion: resumen
      ? resumen.substring(0, 300) + "..."
      : "Receta obtenida de Spoonacular. El texto original está en inglés.",
    ingredientes: ingredientes,
    pasos: pasos,
    imagen: plato.image || null,
    origen: "api",
  };
}
