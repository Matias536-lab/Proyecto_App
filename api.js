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


// ------------------------------------------------------------
// TRADUCCIONES PARA LAS RECETAS DE INTERNET
//
// La API manda el país y la categoría en inglés ("Malaysian", "Beef").
// Acá los pasamos a español para poder redactar la descripción.
// ------------------------------------------------------------
const COCINAS_ES = {
  American: "estadounidense",
  British: "británica",
  Canadian: "canadiense",
  Chinese: "china",
  Croatian: "croata",
  Dutch: "neerlandesa",
  Egyptian: "egipcia",
  Filipino: "filipina",
  French: "francesa",
  Greek: "griega",
  Indian: "india",
  Irish: "irlandesa",
  Italian: "italiana",
  Jamaican: "jamaiquina",
  Japanese: "japonesa",
  Kenyan: "keniana",
  Malaysian: "malaya",
  Mexican: "mexicana",
  Moroccan: "marroquí",
  Polish: "polaca",
  Portuguese: "portuguesa",
  Russian: "rusa",
  Spanish: "española",
  Thai: "tailandesa",
  Tunisian: "tunecina",
  Turkish: "turca",
  Ukrainian: "ucraniana",
  Uruguayan: "uruguaya",
  Vietnamese: "vietnamita",
};

const CATEGORIAS_API_ES = {
  Beef: "carnes",
  Breakfast: "desayunos",
  Chicken: "pollo",
  Dessert: "postres",
  Goat: "cabrito",
  Lamb: "cordero",
  Miscellaneous: "varios",
  Pasta: "pastas",
  Pork: "cerdo",
  Seafood: "pescados y mariscos",
  Side: "guarniciones",
  Starter: "entradas",
  Vegan: "cocina vegana",
  Vegetarian: "cocina vegetariana",
};

// Ingredientes más comunes, para poder nombrar los principales en español.
// Si un ingrediente no está en esta lista, simplemente no lo mencionamos:
// preferimos decir menos antes que mezclar los dos idiomas.
const INGREDIENTES_EN_ES = {
  beef: "carne vacuna", chicken: "pollo", pork: "cerdo", lamb: "cordero",
  bacon: "panceta", sausage: "salchicha", ham: "jamón", turkey: "pavo",
  fish: "pescado", salmon: "salmón", tuna: "atún", prawns: "langostinos",
  shrimp: "camarones", "minced beef": "carne picada",
  onion: "cebolla", onions: "cebolla", garlic: "ajo", tomato: "tomate",
  tomatoes: "tomate", potato: "papa", potatoes: "papas", carrot: "zanahoria",
  carrots: "zanahoria", pepper: "morrón", mushrooms: "hongos",
  spinach: "espinaca", lettuce: "lechuga", broccoli: "brócoli",
  celery: "apio", cucumber: "pepino", peas: "arvejas", corn: "choclo",
  cabbage: "repollo", zucchini: "zapallito", pumpkin: "zapallo",
  rice: "arroz", pasta: "pasta", noodles: "fideos", flour: "harina",
  bread: "pan", oats: "avena", sugar: "azúcar", salt: "sal",
  butter: "manteca", milk: "leche", cream: "crema", cheese: "queso",
  eggs: "huevos", egg: "huevo", yoghurt: "yogur", oil: "aceite",
  "olive oil": "aceite de oliva", "vegetable oil": "aceite",
  lemon: "limón", lime: "lima", orange: "naranja", apple: "manzana",
  banana: "banana", strawberries: "frutillas", coconut: "coco",
  chocolate: "chocolate", honey: "miel", vanilla: "vainilla",
  cinnamon: "canela", ginger: "jengibre", parsley: "perejil",
  basil: "albahaca", oregano: "orégano", rosemary: "romero",
  thyme: "tomillo", curry: "curry", paprika: "pimentón",
  "soy sauce": "salsa de soja", "coconut milk": "leche de coco",
  water: "agua", wine: "vino", beans: "porotos", lentils: "lentejas",
  chickpeas: "garbanzos",
};

// Busca el ingrediente en la lista. Prueba el nombre entero y,
// si no aparece, cada palabra por separado ("Vegetable Oil" -> "aceite").
function traducirIngrediente(nombre) {
  const limpio = normalizar(nombre);
  if (!limpio) return null;

  if (INGREDIENTES_EN_ES[limpio]) return INGREDIENTES_EN_ES[limpio];

  const palabras = limpio.split(" ");
  for (let i = 0; i < palabras.length; i++) {
    if (INGREDIENTES_EN_ES[palabras[i]]) return INGREDIENTES_EN_ES[palabras[i]];
  }
  return null;
}

// Une una lista en una frase: "a, b y c"
function unirConY(lista) {
  if (lista.length === 1) return lista[0];
  return lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1];
}

// ------------------------------------------------------------
// ARMA LA DESCRIPCIÓN DE UNA RECETA DE INTERNET
//
// La API no manda ningún resumen del plato, así que lo redactamos
// nosotros con los datos que sí manda: país, categoría, ingredientes
// y cantidad de pasos. Todo lo que dice es información real de la API:
// no inventamos historia ni origen del plato.
// ------------------------------------------------------------
function armarDescripcion(plato, nombresIngredientes, cantidadPasos) {
  const frases = [];

  // 1) De dónde es y de qué tipo es
  const cocina = COCINAS_ES[plato.strArea];
  const categoria = CATEGORIAS_API_ES[plato.strCategory];

  if (cocina && categoria) {
    frases.push(
      "Plato de la cocina " + cocina + ", dentro de la categoría " + categoria + "."
    );
  } else if (cocina) {
    frases.push("Plato de la cocina " + cocina + ".");
  } else if (categoria) {
    frases.push("Plato de la categoría " + categoria + ".");
  } else {
    frases.push("Receta de cocina internacional.");
  }

  // 2) Con qué se prepara: nombramos hasta 3 ingredientes reconocibles
  const principales = [];
  for (let i = 0; i < nombresIngredientes.length && principales.length < 3; i++) {
    const traducido = traducirIngrediente(nombresIngredientes[i]);
    if (traducido && principales.indexOf(traducido) === -1) {
      principales.push(traducido);
    }
  }

  const total = nombresIngredientes.length;

  if (principales.length >= 2) {
    frases.push(
      "Se prepara con " + unirConY(principales) +
      ", entre " + total + " ingredientes en total."
    );
  } else if (total > 0) {
    frases.push(
      "Lleva " + total + (total === 1 ? " ingrediente." : " ingredientes.")
    );
  }

  // 3) Qué tan larga es la preparación
  if (cantidadPasos === 1) {
    frases.push("Su elaboración es de un solo paso.");
  } else if (cantidadPasos > 1) {
    frases.push("Su elaboración se divide en " + cantidadPasos + " pasos.");
  }

  // 4) Aviso de idioma
  frases.push(
    "El texto original de la receta está en inglés, tal como lo publica TheMealDB."
  );

  return frases.join(" ");
}

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
  const nombresIngredientes = [];

  for (let i = 1; i <= 20; i++) {
    const nombre = plato["strIngredient" + i];
    const medida = plato["strMeasure" + i];

    if (nombre && String(nombre).trim() !== "") {
      const linea = (String(medida || "").trim() + " " + String(nombre).trim()).trim();
      ingredientes.push(linea);
      // Guardamos aparte el nombre sin la cantidad, para la descripción
      nombresIngredientes.push(String(nombre).trim());
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
    categoria: CATEGORIAS_API_ES[plato.strCategory] || "De internet",
    tiempo: "",
    porciones: "",
    descripcion: armarDescripcion(plato, nombresIngredientes, pasos.length),
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
      "Falta cargar la API key de Spoonacular en el archivo api.js."
    );
  }

  const url =
    "https://api.spoonacular.com/recipes/complexSearch" +
    "?query=" + encodeURIComponent(consulta) +
    "&number=8" +
    "&addRecipeInformation=true" +
    "&fillIngredients=true" +
    "&apiKey=" + SPOONACULAR_API_KEY;

  const respuesta = await fetch(url);

  // Mensajes claros según qué salió mal
  if (respuesta.status === 401) {
    throw new Error("La API key de Spoonacular no es válida.");
  }
  if (respuesta.status === 402) {
    throw new Error(
      "Se agotaron los créditos diarios de Spoonacular. Probá de nuevo mañana."
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