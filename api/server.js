const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/ping', async (req, res) => {
  try {
    const [filas] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');
    res.json({ estado: 'ok', usuarios_registrados: filas[0].total });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo conectar a MySQL', detalle: e.message });
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
    const hash = await bcrypt.hash(contrasena, 10);

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nombre, email, contrasena_hash) VALUES (?, ?, ?)',
      [nombre, email, hash]
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

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!coincide) {
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
      'SELECT id, nombre, email, foto, fecha_registro, ultimo_acceso FROM usuarios WHERE id = ?',
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
      fecha_registro: filas[0].fecha_registro,
      ultimo_acceso: filas[0].ultimo_acceso,
      recetas_creadas: creadas[0].total,
      recetas_favoritas: favoritas[0].total
    });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo traer el perfil', detalle: e.message });
  }
});


app.listen(config.puerto, '0.0.0.0', () => {
  console.log('API de MyKitchen escuchando en el puerto ' + config.puerto);
});