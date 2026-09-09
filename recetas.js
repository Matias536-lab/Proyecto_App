// ============================================================
// recetas.js
// Base de datos propia de MyKitchen, en español.
// Estas recetas NO dependen de internet ni de ninguna API:
// están dentro de la app, así que la búsqueda siempre funciona.
//
// Las categorías son las 4 comidas del día que definimos
// en la consigna: Desayuno, Almuerzo, Merienda y Cena.
//
// Para agregar una receta nueva, copiá un bloque entero
// y cambiale los datos. El "id" no se puede repetir.
//
// El campo "imagen" es la foto del plato. Si alguna no carga,
// reemplazá esa dirección por otra (unsplash.com > clic derecho
// sobre la foto > "Copiar dirección de imagen").
// ============================================================

export const CATEGORIAS = [
  { id: "Desayuno", nombre: "Desayuno", descripcion: "Para empezar el día" },
  { id: "Almuerzo", nombre: "Almuerzo", descripcion: "El plato fuerte del mediodía" },
  { id: "Merienda", nombre: "Merienda", descripcion: "Algo dulce para la tarde" },
  { id: "Cena", nombre: "Cena", descripcion: "Liviano para la noche" },
];

export const RECETAS_LOCALES = [
  // ---------------------- DESAYUNO ----------------------
  {
    id: "local-1",
    nombre: "Tostadas con Palta y Huevo",
    categoria: "Desayuno",
    imagen:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=800",
    tiempo: "10 minutos",
    porciones: "1 porción",
    descripcion:
      "Un desayuno completo que combina grasas saludables de la palta con la proteína del huevo. Muy popular por lo rápido que se prepara y porque mantiene la saciedad durante toda la mañana.",
    ingredientes: [
      "2 rebanadas de pan integral",
      "1 palta madura",
      "1 huevo",
      "1 cucharadita de aceite de oliva",
      "Sal y pimienta a gusto",
      "Unas gotas de jugo de limón",
    ],
    pasos: [
      "Tostar las dos rebanadas de pan hasta que estén doradas.",
      "Cortar la palta al medio, sacarle el carozo y pisar la pulpa con un tenedor.",
      "Mezclar la palta pisada con el jugo de limón, sal y pimienta.",
      "Cocinar el huevo a la plancha con el aceite de oliva, unos 3 minutos.",
      "Untar la palta sobre las tostadas y apoyar el huevo encima.",
    ],
    origen: "local",
  },
  {
    id: "local-2",
    nombre: "Panqueques de Avena y Banana",
    categoria: "Desayuno",
    imagen:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800",
    tiempo: "20 minutos",
    porciones: "2 porciones",
    descripcion:
      "Versión más nutritiva del panqueque clásico: se reemplaza la harina por avena y el azúcar por banana madura. No lleva azúcar agregada.",
    ingredientes: [
      "1 banana madura",
      "2 huevos",
      "1 taza de avena instantánea",
      "1/2 taza de leche",
      "1 cucharadita de polvo para hornear",
      "1 pizca de canela",
      "Manteca o rocío vegetal para la sartén",
    ],
    pasos: [
      "Pisar la banana en un bol hasta que quede como puré.",
      "Agregar los huevos y la leche, y mezclar bien.",
      "Incorporar la avena, el polvo para hornear y la canela. Dejar reposar 5 minutos.",
      "Calentar una sartén antiadherente con un poco de manteca.",
      "Volcar un cucharón de mezcla y cocinar 2 minutos de cada lado, hasta dorar.",
    ],
    origen: "local",
  },
  {
    id: "local-3",
    nombre: "Yogur con Granola y Frutas",
    categoria: "Desayuno",
    imagen:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800",
    tiempo: "5 minutos",
    porciones: "1 porción",
    descripcion:
      "El desayuno más rápido de todos. Aporta calcio, fibra y vitaminas. Se puede armar la noche anterior y guardar en la heladera.",
    ingredientes: [
      "1 pote de yogur natural o griego",
      "4 cucharadas de granola",
      "1 banana en rodajas",
      "1 puñado de frutillas o arándanos",
      "1 cucharada de miel",
    ],
    pasos: [
      "Colocar el yogur en un bol o frasco de vidrio.",
      "Agregar una capa de granola por encima.",
      "Sumar la fruta cortada en trozos.",
      "Terminar con un hilo de miel por arriba.",
    ],
    origen: "local",
  },
  {
    id: "local-4",
    nombre: "Huevos Revueltos con Queso",
    categoria: "Desayuno",
    imagen:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    tiempo: "8 minutos",
    porciones: "1 porción",
    descripcion:
      "Clásico desayuno salado, alto en proteínas. El secreto está en cocinarlo a fuego bajo y revolver constantemente para que queden cremosos y no secos.",
    ingredientes: [
      "3 huevos",
      "50 g de queso cremoso o mozzarella",
      "1 cucharada de manteca",
      "1 chorrito de leche",
      "Sal y pimienta a gusto",
    ],
    pasos: [
      "Batir los huevos con la leche, sal y pimienta.",
      "Derretir la manteca en una sartén a fuego bajo.",
      "Volcar los huevos y revolver suavemente con espátula de madera.",
      "Cuando estén casi cuajados, agregar el queso en cubos.",
      "Retirar del fuego apenas el queso se derrita: siguen cocinándose con el calor residual.",
    ],
    origen: "local",
  },
  {
    id: "local-5",
    nombre: "Licuado de Banana y Leche",
    categoria: "Desayuno",
    imagen:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800",
    tiempo: "5 minutos",
    porciones: "2 porciones",
    descripcion:
      "Bebida energética natural, ideal para quienes no toleran comer sólido al despertarse. Aporta potasio y calcio.",
    ingredientes: [
      "2 bananas maduras",
      "500 ml de leche fría",
      "2 cucharadas de azúcar o miel",
      "1 pizca de canela",
      "Hielo a gusto",
    ],
    pasos: [
      "Pelar las bananas y cortarlas en trozos.",
      "Colocar todos los ingredientes en la licuadora.",
      "Licuar durante 1 minuto hasta que no queden grumos.",
      "Servir bien frío y espolvorear canela por encima.",
    ],
    origen: "local",
  },

  // ---------------------- ALMUERZO ----------------------
  {
    id: "local-6",
    nombre: "Milanesa con Puré de Papas",
    categoria: "Almuerzo",
    imagen:
      "https://images.unsplash.com/photo-1599921841143-819065a55cc6?q=80&w=800",
    tiempo: "45 minutos",
    porciones: "4 porciones",
    descripcion:
      "Probablemente el plato más emblemático de la mesa argentina. La milanesa llegó con la inmigración italiana y se adaptó hasta volverse un símbolo local.",
    ingredientes: [
      "4 bifes de nalga finos",
      "2 huevos",
      "300 g de pan rallado",
      "1 kg de papas",
      "200 ml de leche",
      "50 g de manteca",
      "1 diente de ajo picado",
      "Perejil, sal y pimienta",
      "Aceite para freír",
    ],
    pasos: [
      "Batir los huevos con el ajo, el perejil, sal y pimienta.",
      "Pasar cada bife por el huevo batido y luego por el pan rallado, presionando bien.",
      "Dejar reposar las milanesas 15 minutos en la heladera para que el rebozado se adhiera.",
      "Hervir las papas peladas en agua con sal durante 20 minutos, hasta que estén tiernas.",
      "Pisar las papas y mezclar con la leche caliente y la manteca hasta lograr un puré cremoso.",
      "Freír las milanesas en aceite bien caliente, 3 minutos de cada lado, y escurrir sobre papel absorbente.",
    ],
    origen: "local",
  },
  {
    id: "local-7",
    nombre: "Empanadas de Carne",
    categoria: "Almuerzo",
    imagen:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800",
    tiempo: "1 hora 15 minutos",
    porciones: "12 empanadas",
    descripcion:
      "Cada provincia argentina tiene su versión: con papa, con aceituna, al horno o fritas. Esta es la receta base del relleno clásico, cortado a cuchillo.",
    ingredientes: [
      "12 tapas de empanada para horno",
      "700 g de carne picada o cortada a cuchillo",
      "2 cebollas grandes",
      "1 cebolla de verdeo",
      "2 huevos duros",
      "100 g de aceitunas verdes descarozadas",
      "1 cucharada de pimentón dulce",
      "1 cucharadita de comino",
      "Sal, pimienta y aceite",
    ],
    pasos: [
      "Picar las cebollas finamente y rehogarlas en aceite hasta que estén transparentes.",
      "Agregar la carne y cocinar hasta que pierda el color rosado.",
      "Condimentar con pimentón, comino, sal y pimienta. Cocinar 5 minutos más.",
      "Dejar enfriar el relleno completamente en la heladera (importante: si está caliente, rompe la masa).",
      "Sumar el huevo duro picado, las aceitunas y la cebolla de verdeo.",
      "Rellenar las tapas, cerrar haciendo el repulgue y hornear a 200 °C durante 15 minutos.",
    ],
    origen: "local",
  },
  {
    id: "local-8",
    nombre: "Fideos con Tuco",
    categoria: "Almuerzo",
    imagen:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800",
    tiempo: "40 minutos",
    porciones: "4 porciones",
    descripcion:
      "El 'tuco' es la salsa de tomate cocida a fuego lento, herencia directa de la cocina italiana en el Río de la Plata. Cuanto más tiempo hierve, mejor sabor.",
    ingredientes: [
      "500 g de fideos secos",
      "800 g de tomate triturado",
      "1 cebolla",
      "1 morrón rojo",
      "2 dientes de ajo",
      "1 cucharadita de azúcar",
      "Orégano, laurel, sal y pimienta",
      "Queso rallado para servir",
    ],
    pasos: [
      "Picar la cebolla, el morrón y el ajo, y rehogarlos en aceite a fuego medio durante 8 minutos.",
      "Agregar el tomate triturado, la hoja de laurel y el azúcar (corta la acidez del tomate).",
      "Cocinar a fuego bajo, destapado, durante 25 minutos, revolviendo cada tanto.",
      "Condimentar con orégano, sal y pimienta al final de la cocción.",
      "Hervir los fideos en abundante agua con sal según el tiempo del paquete.",
      "Escurrir, mezclar con el tuco y servir con queso rallado.",
    ],
    origen: "local",
  },
  {
    id: "local-9",
    nombre: "Pollo al Horno con Papas",
    categoria: "Almuerzo",
    imagen:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800",
    tiempo: "1 hora 10 minutos",
    porciones: "4 porciones",
    descripcion:
      "Plato de domingo por excelencia. Se cocina todo junto en una sola fuente, así que ensucia poco y el jugo del pollo condimenta las papas.",
    ingredientes: [
      "1 pollo entero cortado en presas",
      "1 kg de papas",
      "2 limones",
      "4 dientes de ajo",
      "1 ramita de romero",
      "100 ml de aceite de oliva",
      "Sal, pimienta y pimentón",
    ],
    pasos: [
      "Precalentar el horno a 200 °C.",
      "Condimentar las presas de pollo con sal, pimienta, pimentón y el jugo de un limón.",
      "Pelar las papas y cortarlas en gajos gruesos.",
      "Disponer todo en una fuente, agregar el ajo aplastado, el romero y rociar con aceite de oliva.",
      "Hornear 45 minutos, dando vuelta las presas a la mitad de la cocción.",
      "Subir a 220 °C los últimos 10 minutos para que la piel quede bien dorada y crocante.",
    ],
    origen: "local",
  },
  {
    id: "local-10",
    nombre: "Ensalada César",
    categoria: "Almuerzo",
    imagen:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=800",
    tiempo: "25 minutos",
    porciones: "2 porciones",
    descripcion:
      "Creada en México en 1924 por el cocinero italiano Cesare Cardini, no en Roma como suele creerse. Es una opción de almuerzo liviano pero con buena carga de proteína.",
    ingredientes: [
      "1 planta de lechuga romana",
      "2 pechugas de pollo",
      "100 g de queso parmesano en escamas",
      "2 rebanadas de pan lácteo para croutons",
      "4 cucharadas de mayonesa",
      "1 cucharadita de mostaza",
      "1 diente de ajo",
      "Jugo de 1/2 limón, sal y pimienta",
    ],
    pasos: [
      "Cortar el pan en cubos y tostarlo en el horno con un poco de aceite hasta que quede crocante.",
      "Cocinar las pechugas a la plancha con sal y pimienta, y cortarlas en tiras.",
      "Preparar el aderezo mezclando la mayonesa, la mostaza, el ajo picado y el jugo de limón.",
      "Lavar y cortar la lechuga en trozos grandes.",
      "Mezclar la lechuga con el aderezo, y coronar con el pollo, los croutons y el parmesano.",
    ],
    origen: "local",
  },

  // ---------------------- MERIENDA ----------------------
  {
    id: "local-11",
    nombre: "Alfajores de Maicena",
    categoria: "Merienda",
    imagen:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800",
    tiempo: "50 minutos",
    porciones: "18 alfajores",
    descripcion:
      "El alfajor de maicena es un ícono de la merienda argentina. La textura arenosa que se deshace en la boca viene justamente del alto porcentaje de almidón de maíz.",
    ingredientes: [
      "300 g de almidón de maíz (maicena)",
      "200 g de harina 0000",
      "200 g de manteca pomada",
      "150 g de azúcar",
      "3 yemas",
      "1 cucharadita de polvo para hornear",
      "Ralladura de 1 limón",
      "400 g de dulce de leche repostero",
      "100 g de coco rallado",
    ],
    pasos: [
      "Batir la manteca con el azúcar hasta obtener una crema pálida.",
      "Incorporar las yemas de a una y la ralladura de limón.",
      "Agregar la maicena, la harina y el polvo para hornear tamizados. Unir sin amasar de más.",
      "Estirar la masa de 1 cm de espesor y cortar discos. Llevar a la heladera 20 minutos.",
      "Hornear a 180 °C durante 10 minutos: no deben dorarse, quedan pálidos.",
      "Una vez fríos, unir de a dos con dulce de leche y pasar los bordes por coco rallado.",
    ],
    origen: "local",
  },
  {
    id: "local-12",
    nombre: "Torta de Chocolate",
    categoria: "Merienda",
    imagen:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800",
    tiempo: "1 hora",
    porciones: "10 porciones",
    descripcion:
      "Bizcochuelo húmedo de chocolate. El truco menos conocido: agregar café caliente a la mezcla no le da gusto a café, sino que intensifica el sabor del cacao.",
    ingredientes: [
      "250 g de harina 0000",
      "300 g de azúcar",
      "80 g de cacao amargo en polvo",
      "2 huevos",
      "250 ml de leche",
      "120 ml de aceite neutro",
      "1 taza de café caliente",
      "2 cucharaditas de polvo para hornear",
      "1 cucharadita de bicarbonato de sodio",
    ],
    pasos: [
      "Precalentar el horno a 175 °C y enmantecar un molde de 24 cm.",
      "Mezclar en un bol todos los ingredientes secos: harina, azúcar, cacao, polvo de hornear y bicarbonato.",
      "Agregar los huevos, la leche y el aceite. Batir 2 minutos hasta integrar.",
      "Incorporar el café caliente: la mezcla va a quedar muy líquida, es correcto.",
      "Volcar en el molde y hornear 35 minutos, hasta que al pinchar salga limpio.",
      "Dejar enfriar dentro del molde 15 minutos antes de desmoldar.",
    ],
    origen: "local",
  },
  {
    id: "local-13",
    nombre: "Budín de Limón",
    categoria: "Merienda",
    imagen:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800",
    tiempo: "55 minutos",
    porciones: "8 porciones",
    descripcion:
      "Budín cítrico con glaseado. Acompaña muy bien el mate o el té. Se conserva tierno hasta cuatro días en un recipiente cerrado.",
    ingredientes: [
      "200 g de harina leudante",
      "200 g de azúcar",
      "150 g de manteca blanda",
      "3 huevos",
      "Ralladura y jugo de 2 limones",
      "100 ml de leche",
      "150 g de azúcar impalpable para el glaseado",
    ],
    pasos: [
      "Batir la manteca con el azúcar hasta que quede cremosa y clara.",
      "Añadir los huevos de a uno, batiendo bien entre cada agregado.",
      "Incorporar la ralladura de limón y la mitad del jugo.",
      "Alternar la harina y la leche, mezclando con movimientos envolventes.",
      "Verter en molde de budín y hornear a 180 °C durante 40 minutos.",
      "Mezclar el azúcar impalpable con el jugo de limón restante y bañar el budín ya frío.",
    ],
    origen: "local",
  },
  {
    id: "local-14",
    nombre: "Submarino",
    categoria: "Merienda",
    imagen:
      "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?q=80&w=800",
    tiempo: "7 minutos",
    porciones: "1 porción",
    descripcion:
      "Bebida típica de las confiterías argentinas. Se llama así porque la barra de chocolate se hunde en la leche caliente y se derrite lentamente en la taza.",
    ingredientes: [
      "300 ml de leche entera",
      "1 barra de chocolate semiamargo (30 g)",
      "1 cucharadita de azúcar (opcional)",
      "1 pizca de esencia de vainilla",
    ],
    pasos: [
      "Calentar la leche hasta que esté bien caliente pero sin llegar a hervir.",
      "Agregar la esencia de vainilla y el azúcar si se desea.",
      "Servir la leche en una taza alta.",
      "Sumergir la barra de chocolate y revolver hasta que se derrita por completo.",
    ],
    origen: "local",
  },
  {
    id: "local-15",
    nombre: "Pastafrola",
    categoria: "Merienda",
    imagen:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800",
    tiempo: "1 hora 10 minutos",
    porciones: "10 porciones",
    descripcion:
      "Tarta de masa dulce rellena con dulce de membrillo o batata, reconocible por su enrejado. Viene de la 'pasta frolla' italiana y se adoptó como clásico rioplatense.",
    ingredientes: [
      "300 g de harina 0000",
      "150 g de manteca fría",
      "100 g de azúcar",
      "1 huevo y 1 yema",
      "1 cucharadita de polvo para hornear",
      "Ralladura de 1 limón",
      "500 g de dulce de membrillo",
      "3 cucharadas de agua caliente",
    ],
    pasos: [
      "Mezclar la harina con el azúcar, el polvo para hornear y la manteca fría en cubos, hasta lograr un arenado.",
      "Agregar el huevo, la yema y la ralladura. Unir sin amasar y llevar a la heladera 30 minutos.",
      "Ablandar el dulce de membrillo con el agua caliente hasta que quede untable.",
      "Estirar 2/3 de la masa y forrar una tartera de 26 cm.",
      "Cubrir con el dulce y decorar con tiras de la masa restante formando el enrejado.",
      "Hornear a 180 °C durante 35 minutos, hasta que la masa esté apenas dorada.",
    ],
    origen: "local",
  },

  // ---------------------- CENA ----------------------
  {
    id: "local-16",
    nombre: "Tarta de Zapallitos y Cebolla",
    categoria: "Cena",
    imagen:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800",
    tiempo: "50 minutos",
    porciones: "6 porciones",
    descripcion:
      "Cena liviana y económica que rinde mucho. Se puede comer caliente o fría al día siguiente, y admite cualquier verdura de estación.",
    ingredientes: [
      "2 tapas de masa para tarta",
      "4 zapallitos verdes",
      "2 cebollas",
      "3 huevos",
      "200 g de queso cremoso",
      "50 g de queso rallado",
      "Aceite, sal, pimienta y nuez moscada",
    ],
    pasos: [
      "Cortar los zapallitos en rodajas finas y la cebolla en pluma.",
      "Rehogar la cebolla en aceite 5 minutos, agregar los zapallitos y cocinar 10 minutos más.",
      "Dejar enfriar y escurrir bien el líquido que soltaron las verduras.",
      "Batir los huevos con el queso rallado, sal, pimienta y nuez moscada.",
      "Mezclar con las verduras y el queso cremoso en cubos.",
      "Forrar la tartera con una tapa, volcar el relleno, cubrir con la otra tapa y hornear a 190 °C por 30 minutos.",
    ],
    origen: "local",
  },
  {
    id: "local-17",
    nombre: "Sopa de Verduras",
    categoria: "Cena",
    imagen:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800",
    tiempo: "40 minutos",
    porciones: "4 porciones",
    descripcion:
      "Cena reconfortante de invierno, muy baja en calorías y alta en fibra. Sirve para aprovechar verduras que están por pasarse.",
    ingredientes: [
      "2 zanahorias",
      "2 papas",
      "1 zapallo pequeño",
      "1 cebolla",
      "1 puerro",
      "2 ramas de apio",
      "1,5 litros de caldo de verduras",
      "Aceite de oliva, sal y pimienta",
    ],
    pasos: [
      "Pelar y cortar todas las verduras en cubos parejos de 2 cm.",
      "Rehogar la cebolla y el puerro en aceite de oliva durante 5 minutos.",
      "Incorporar el resto de las verduras y saltear 3 minutos.",
      "Agregar el caldo caliente y llevar a hervor.",
      "Bajar el fuego y cocinar 25 minutos, hasta que todo esté tierno.",
      "Condimentar y, si se prefiere crema, procesar con mixer hasta que quede lisa.",
    ],
    origen: "local",
  },
  {
    id: "local-18",
    nombre: "Omelette de Jamón y Queso",
    categoria: "Cena",
    imagen:
      "https://images.unsplash.com/photo-1510693206972-df098062cb1d?q=80&w=800",
    tiempo: "12 minutos",
    porciones: "1 porción",
    descripcion:
      "La cena más rápida que existe cuando no hay tiempo ni ganas. La clave técnica es el fuego bajo: si se cocina fuerte, se seca y se rompe.",
    ingredientes: [
      "3 huevos",
      "2 fetas de jamón cocido",
      "80 g de queso mozzarella",
      "1 cucharada de manteca",
      "Sal, pimienta y perejil picado",
    ],
    pasos: [
      "Batir los huevos con sal, pimienta y perejil hasta integrar bien.",
      "Derretir la manteca en una sartén chica a fuego bajo.",
      "Volcar los huevos y dejar cuajar sin revolver durante 3 minutos.",
      "Cuando la superficie esté casi seca, distribuir el jamón y el queso sobre una mitad.",
      "Doblar el omelette al medio y cocinar 1 minuto más para que el queso se derrita.",
    ],
    origen: "local",
  },
  {
    id: "local-19",
    nombre: "Guiso de Lentejas",
    categoria: "Cena",
    imagen:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800",
    tiempo: "1 hora",
    porciones: "6 porciones",
    descripcion:
      "Plato de olla tradicional del invierno argentino. Las lentejas aportan hierro y proteína vegetal, y combinadas con arroz forman una proteína completa.",
    ingredientes: [
      "500 g de lentejas",
      "200 g de panceta o chorizo colorado",
      "1 cebolla",
      "1 morrón rojo",
      "2 zanahorias",
      "2 papas",
      "400 g de tomate triturado",
      "1,5 litros de caldo",
      "Pimentón, laurel, sal y pimienta",
    ],
    pasos: [
      "Remojar las lentejas en agua fría durante 2 horas y escurrirlas.",
      "Dorar la panceta o el chorizo en una olla grande.",
      "Agregar la cebolla, el morrón y la zanahoria picados. Rehogar 8 minutos.",
      "Sumar el tomate triturado, el pimentón y el laurel. Cocinar 5 minutos.",
      "Incorporar las lentejas, las papas en cubos y el caldo caliente.",
      "Cocinar a fuego bajo 35 minutos, hasta que las lentejas estén tiernas y el guiso espeso.",
    ],
    origen: "local",
  },
  {
    id: "local-20",
    nombre: "Zapallitos Rellenos",
    categoria: "Cena",
    imagen:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800",
    tiempo: "55 minutos",
    porciones: "4 porciones",
    descripcion:
      "Cena de verano típica de la cocina casera. Se aprovecha la pulpa del propio zapallito en el relleno, así que casi no genera desperdicio.",
    ingredientes: [
      "8 zapallitos redondos",
      "300 g de carne picada",
      "1 cebolla",
      "1 huevo",
      "3 cucharadas de pan rallado",
      "100 g de queso rallado",
      "Aceite, sal, pimienta y orégano",
    ],
    pasos: [
      "Hervir los zapallitos enteros durante 10 minutos y dejarlos entibiar.",
      "Cortarles la tapa y ahuecarlos con una cuchara, reservando la pulpa.",
      "Rehogar la cebolla picada, agregar la carne y cocinar hasta dorar.",
      "Mezclar la carne con la pulpa picada, el huevo, el pan rallado y la mitad del queso.",
      "Rellenar los zapallitos y espolvorear con el queso restante.",
      "Gratinar en horno a 200 °C durante 20 minutos, hasta que la superficie esté dorada.",
    ],
    origen: "local",
  },
];