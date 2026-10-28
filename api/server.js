const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());


// Conexion a MySQL. Se usa un pool en vez de una conexion sola porque
// varios celulares pueden pedir cosas al mismo tiempo.
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10
});


app.get('/ping', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
    res.json({ estado: 'ok', usuarios_registrados: filas[0].total });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo conectar a MySQL', detalle: e.message });
  }
});


// Lista de usuarios registrados. Sirve para comprobar desde el navegador
// que la base esta respondiendo. No devuelve la contrasena.
app.get('/usuarios', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, email, activo, fecha_registro, ultimo_acceso FROM usuarios ORDER BY id'
    );
    res.json({ total: filas.length, usuarios: filas });
  } catch (e) {
    res.status(500).json({ error: 'No se pudieron traer los usuarios', detalle: e.message });
  }
});


app.post('/registro', async (req, res) => {
  const nombre = (req.body.nombre || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const contrasena = req.body.contrasena || '';

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'El correo no es valido' });
  }
  if (contrasena.length < 6) {
    return res.status(400).json({ error: 'La contrasena debe tener al menos 6 caracteres' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nombre, email, contrasena_hash) VALUES (?, ?, ?)',
      [nombre, email, contrasena]
    );

    res.status(201).json({ id: resultado.insertId, nombre: nombre, email: email });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ese correo ya esta registrado' });
    }
    res.status(500).json({ error: 'No se pudo registrar', detalle: e.message });
  }
});


app.post('/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const contrasena = req.body.contrasena || '';

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, email, contrasena_hash, activo FROM usuarios WHERE email = ?',
      [email]
    );

    if (filas.length === 0) {
      return res.status(401).json({ error: 'Correo o contrasena incorrectos' });
    }

    const usuario = filas[0];

    if (!usuario.activo) {
      return res.status(403).json({ error: 'La cuenta esta desactivada' });
    }

    if (contrasena !== usuario.contrasena_hash) {
      return res.status(401).json({ error: 'Correo o contrasena incorrectos' });
    }

    await pool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [usuario.id]);

    res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo iniciar sesion', detalle: e.message });
  }
});


app.get('/usuarios/:id', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, email, foto, bio, fecha_registro, ultimo_acceso FROM usuarios WHERE id = ?',
      [req.params.id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const [creadas] = await pool.query(
      'SELECT COUNT(*) AS total FROM recetas WHERE autor_id = ?',
      [req.params.id]
    );

    const [favoritas] = await pool.query(
      'SELECT COUNT(*) AS total FROM favoritos WHERE usuario_id = ?',
      [req.params.id]
    );

    res.json({
      id: filas[0].id,
      nombre: filas[0].nombre,
      email: filas[0].email,
      foto: filas[0].foto,
      bio: filas[0].bio,
      fecha_registro: filas[0].fecha_registro,
      ultimo_acceso: filas[0].ultimo_acceso,
      recetas_creadas: creadas[0].total,
      recetas_favoritas: favoritas[0].total
    });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo traer el perfil', detalle: e.message });
  }
});


// Recetas creadas por un usuario. Relacion uno a muchos: usuarios -> recetas.
app.get('/usuarios/:id/recetas', async (req, res) => {
  try {
    const [filas] = await pool.query(
      "SELECT id, nombre, categoria, imagen FROM recetas WHERE autor_id = ? AND origen = 'usuario' ORDER BY fecha_creacion DESC",
      [req.params.id]
    );
    res.json(filas);
  } catch (e) {
    res.status(500).json({ error: 'No se pudieron traer las recetas', detalle: e.message });
  }
});


// Recetas que el usuario marco como favoritas. Relacion muchos a muchos,
// por eso hace falta el JOIN contra la tabla favoritos.
app.get('/usuarios/:id/favoritos', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT r.id, r.nombre, r.categoria, r.imagen FROM favoritos f JOIN recetas r ON f.receta_id = r.id WHERE f.usuario_id = ? ORDER BY f.fecha DESC',
      [req.params.id]
    );
    res.json(filas);
  } catch (e) {
    res.status(500).json({ error: 'No se pudieron traer los favoritos', detalle: e.message });
  }
});


// Una receta completa con sus ingredientes y sus pasos, en el formato que
// espera DetalleRecetaScreen. Son tres consultas porque los ingredientes y
// los pasos viven en sus propias tablas.
app.get('/recetas/:id', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT id, autor_id, nombre, categoria, tiempo, porciones, descripcion, imagen FROM recetas WHERE id = ?',
      [req.params.id]
    );

    if (filas.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const [ingredientes] = await pool.query(
      'SELECT texto FROM ingredientes WHERE receta_id = ? ORDER BY orden',
      [req.params.id]
    );

    const [pasos] = await pool.query(
      'SELECT texto FROM pasos WHERE receta_id = ? ORDER BY orden',
      [req.params.id]
    );

    res.json({
      id: filas[0].id,
      nombre: filas[0].nombre,
      categoria: filas[0].categoria,
      tiempo: filas[0].tiempo,
      porciones: filas[0].porciones,
      descripcion: filas[0].descripcion,
      imagen: filas[0].imagen,
      ingredientes: ingredientes.map((f) => f.texto),
      pasos: pasos.map((f) => f.texto),
      origen: 'bdd'
    });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo traer la receta', detalle: e.message });
  }
});


// Crear una receta con sus ingredientes y sus pasos.
//
// Las tres tablas se escriben dentro de una TRANSACCION. Eso significa que
// o entran las tres cosas, o no entra ninguna. Sin esto podria quedar una
// receta guardada a la que le falten los pasos porque algo fallo en el medio.
app.post('/recetas', async (req, res) => {
  const autorId = req.body.autor_id;
  const nombre = (req.body.nombre || '').trim();
  const categoria = (req.body.categoria || '').trim();
  const tiempo = (req.body.tiempo || '').trim() || null;
  const porciones = (req.body.porciones || '').trim() || null;
  const descripcion = (req.body.descripcion || '').trim() || null;
  const imagen = (req.body.imagen || '').trim() || null;

  const ingredientes = Array.isArray(req.body.ingredientes)
    ? req.body.ingredientes.map((t) => String(t).trim()).filter((t) => t !== '')
    : [];

  const pasos = Array.isArray(req.body.pasos)
    ? req.body.pasos.map((t) => String(t).trim()).filter((t) => t !== '')
    : [];

  const CATEGORIAS = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];

  if (!autorId) {
    return res.status(400).json({ error: 'Falta el autor. Inicia sesion para crear recetas.' });
  }
  if (!nombre) {
    return res.status(400).json({ error: 'Falta el nombre de la receta' });
  }
  if (CATEGORIAS.indexOf(categoria) === -1) {
    return res.status(400).json({ error: 'La categoria tiene que ser Desayuno, Almuerzo, Merienda o Cena' });
  }
  if (ingredientes.length === 0) {
    return res.status(400).json({ error: 'La receta necesita al menos un ingrediente' });
  }
  if (pasos.length === 0) {
    return res.status(400).json({ error: 'La receta necesita al menos un paso' });
  }

  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [resultado] = await conexion.query(
      'INSERT INTO recetas (autor_id, nombre, categoria, tiempo, porciones, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [autorId, nombre, categoria, tiempo, porciones, descripcion, imagen]
    );

    const recetaId = resultado.insertId;

    // El "orden" guarda la posicion de cada fila, porque las filas de una
    // tabla no tienen un orden garantizado al leerlas.
    for (let i = 0; i < ingredientes.length; i++) {
      await conexion.query(
        'INSERT INTO ingredientes (receta_id, texto, orden) VALUES (?, ?, ?)',
        [recetaId, ingredientes[i], i + 1]
      );
    }

    for (let i = 0; i < pasos.length; i++) {
      await conexion.query(
        'INSERT INTO pasos (receta_id, texto, orden) VALUES (?, ?, ?)',
        [recetaId, pasos[i], i + 1]
      );
    }

    await conexion.commit();

    res.status(201).json({
      id: recetaId,
      nombre: nombre,
      categoria: categoria,
      ingredientes: ingredientes.length,
      pasos: pasos.length
    });
  } catch (e) {
    await conexion.rollback();

    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'El usuario que intenta crear la receta no existe' });
    }
    res.status(500).json({ error: 'No se pudo guardar la receta', detalle: e.message });
  } finally {
    conexion.release();
  }
});


// Borrar una receta. Los ingredientes, los pasos y los favoritos se van
// solos por el ON DELETE CASCADE que tienen las claves foraneas.
app.delete('/recetas/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query('DELETE FROM recetas WHERE id = ?', [req.params.id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    res.json({ borrada: true });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo borrar la receta', detalle: e.message });
  }
});


// Guarda en la base una receta que no nacio en la app: una de recetas.js o
// una de TheMealDB. Hace falta porque favoritos tiene una clave foranea a
// recetas: no se puede marcar como favorita una receta que no existe en la
// tabla. Si ya fue importada antes, devuelve la que ya estaba.
app.post('/recetas/importar', async (req, res) => {
  const autorId = req.body.autor_id;
  const origen = (req.body.origen || '').trim();
  const origenId = String(req.body.origen_id || '').trim();
  const nombre = (req.body.nombre || '').trim();
  const categoria = (req.body.categoria || '').trim();
  const tiempo = (req.body.tiempo || '').trim() || null;
  const porciones = (req.body.porciones || '').trim() || null;
  const descripcion = (req.body.descripcion || '').trim() || null;
  const imagen = (req.body.imagen || '').trim() || null;

  const ingredientes = Array.isArray(req.body.ingredientes)
    ? req.body.ingredientes.map((t) => String(t).trim()).filter((t) => t !== '')
    : [];

  const pasos = Array.isArray(req.body.pasos)
    ? req.body.pasos.map((t) => String(t).trim()).filter((t) => t !== '')
    : [];

  if (!autorId || !origen || !origenId || !nombre || !categoria) {
    return res.status(400).json({ error: 'Faltan datos para importar la receta' });
  }

  try {
    const [existentes] = await pool.query(
      'SELECT id FROM recetas WHERE origen = ? AND origen_id = ?',
      [origen, origenId]
    );

    if (existentes.length > 0) {
      return res.json({ id: existentes[0].id, yaExistia: true });
    }
  } catch (e) {
    return res.status(500).json({ error: 'No se pudo revisar la receta', detalle: e.message });
  }

  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    const [resultado] = await conexion.query(
      'INSERT INTO recetas (autor_id, origen, origen_id, nombre, categoria, tiempo, porciones, descripcion, imagen, publica) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)',
      [autorId, origen, origenId, nombre, categoria, tiempo, porciones, descripcion, imagen]
    );

    const recetaId = resultado.insertId;

    for (let i = 0; i < ingredientes.length; i++) {
      await conexion.query(
        'INSERT INTO ingredientes (receta_id, texto, orden) VALUES (?, ?, ?)',
        [recetaId, ingredientes[i], i + 1]
      );
    }

    for (let i = 0; i < pasos.length; i++) {
      await conexion.query(
        'INSERT INTO pasos (receta_id, texto, orden) VALUES (?, ?, ?)',
        [recetaId, pasos[i], i + 1]
      );
    }

    await conexion.commit();
    res.status(201).json({ id: recetaId, yaExistia: false });
  } catch (e) {
    await conexion.rollback();

    // Si dos pedidos importaron la misma receta al mismo tiempo, el indice
    // unico rechaza el segundo. No es un error: se devuelve el que quedo.
    if (e.code === 'ER_DUP_ENTRY') {
      const [filas] = await pool.query(
        'SELECT id FROM recetas WHERE origen = ? AND origen_id = ?',
        [origen, origenId]
      );
      if (filas.length > 0) {
        return res.json({ id: filas[0].id, yaExistia: true });
      }
    }
    res.status(500).json({ error: 'No se pudo importar la receta', detalle: e.message });
  } finally {
    conexion.release();
  }
});


// Preguntar si una receta esta entre los favoritos de un usuario.
app.get('/favoritos/:usuarioId/:recetaId', async (req, res) => {
  try {
    const [filas] = await pool.query(
      'SELECT 1 FROM favoritos WHERE usuario_id = ? AND receta_id = ?',
      [req.params.usuarioId, req.params.recetaId]
    );
    res.json({ favorito: filas.length > 0 });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo consultar el favorito', detalle: e.message });
  }
});


// Marcar como favorita. La clave primaria de favoritos son las dos columnas
// juntas, asi que la misma persona no puede guardar dos veces la misma receta.
app.post('/favoritos', async (req, res) => {
  const usuarioId = req.body.usuario_id;
  const recetaId = req.body.receta_id;

  if (!usuarioId || !recetaId) {
    return res.status(400).json({ error: 'Faltan el usuario o la receta' });
  }

  try {
    await pool.query('INSERT INTO favoritos (usuario_id, receta_id) VALUES (?, ?)', [
      usuarioId,
      recetaId
    ]);
    res.status(201).json({ favorito: true });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.json({ favorito: true, yaEstaba: true });
    }
    res.status(500).json({ error: 'No se pudo guardar el favorito', detalle: e.message });
  }
});


// Quitar de favoritos.
app.delete('/favoritos/:usuarioId/:recetaId', async (req, res) => {
  try {
    await pool.query('DELETE FROM favoritos WHERE usuario_id = ? AND receta_id = ?', [
      req.params.usuarioId,
      req.params.recetaId
    ]);
    res.json({ favorito: false });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo quitar el favorito', detalle: e.message });
  }
});


// Prueba la conexion al arrancar, para saber enseguida si MySQL esta apagado
// y no enterarse recien en el primer pedido.
pool.getConnection()
  .then((conexion) => {
    console.log('Conectado a mysql');
    conexion.release();
  })
  .catch((e) => {
    console.error('Error conectando a la base de datos: ' + e.message);
  });


app.listen(config.puerto, '0.0.0.0', () => {
  console.log('Server corriendo en puerto ' + config.puerto);
});
