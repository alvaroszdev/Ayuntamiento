// database.mjs

import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./reservas.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear la tabla 'reservas' si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL
  )
`);

export default db;
