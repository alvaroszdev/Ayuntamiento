// testDb.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./reservas.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Verifica si podemos crear una tabla de prueba
db.run('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)', (err) => {
  if (err) {
    console.error('Error al crear la tabla:', err);
  } else {
    console.log('Tabla de prueba creada o ya existe');
  }

  // Cierra la conexión después de probar
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos:', err);
    } else {
      console.log('Base de datos cerrada');
    }
  });
});
