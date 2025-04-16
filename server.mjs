import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Asegúrate de importar CORS
import sqlite3 from 'sqlite3'; // Asegúrate de tener sqlite3 instalado

// Crear una nueva instancia de Express
const app = express();
const port = 3000;

// Habilitar CORS para permitir solicitudes de otros puertos
app.use(cors());

// Middleware para manejar los datos JSON
app.use(bodyParser.json());

// Crear o abrir la base de datos SQLite
const db = new sqlite3.Database('./reservas.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos', err);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});

// Crear la tabla si no existe (en la base de datos SQLite)
db.run(`
  CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    email TEXT,
    fecha TEXT,
    hora TEXT
  )
`);

// Ruta para la página principal
app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de reservas');
});

// Ruta para crear una reserva (POST)
app.post('/reservas', (req, res) => {
  const { nombre, email, fecha, hora } = req.body;

  // Log para verificar los datos recibidos
  console.log('Datos recibidos:', req.body);

  if (!nombre || !email || !fecha || !hora) {
    console.error('Faltan campos obligatorios');
    return res.status(400).send('Todos los campos son obligatorios');
  }

  // Log antes de insertar en la base de datos
  console.log('Ejecutando inserción en la base de datos con los siguientes datos:', { nombre, email, fecha, hora });

  // Insertar la reserva en la base de datos
  const stmt = db.prepare("INSERT INTO reservas (nombre, email, fecha, hora) VALUES (?, ?, ?, ?)");
  stmt.run([nombre, email, fecha, hora], function (err) {
    if (err) {
      console.error('Error al guardar la reserva:', err);
      return res.status(500).send('Error al guardar la reserva');
    }

    // Log para confirmar que la reserva fue guardada correctamente
    console.log('Reserva guardada correctamente con ID:', this.lastID);

    res.status(200).send({
      message: 'Reserva guardada correctamente',
      id: this.lastID,
    });
  });
  stmt.finalize();
});

// Ruta para obtener todas las reservas (GET)
app.get('/reservas', (req, res) => {
  console.log('Consultando todas las reservas...');
  db.all("SELECT * FROM reservas", (err, rows) => {
    if (err) {
      console.error('Error al obtener las reservas:', err);
      return res.status(500).send('Error al obtener las reservas');
    }

    console.log('Reservas obtenidas:', rows);
    res.json(rows);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
