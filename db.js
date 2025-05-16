const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./lumiere.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    checkin TEXT NOT NULL,
    checkout TEXT NOT NULL,
    status TEXT NOT NULL
  )`, (err) => {
    if (err) console.error(err.message);
  });
});

db.close();
