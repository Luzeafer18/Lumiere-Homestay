const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database("./lumiere.db");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "secretKeyForSession",
  resave: false,
  saveUninitialized: true,
}));

// Middleware: Protect all pages except login and static files
app.use((req, res, next) => {
  const publicPaths = ["/login.html", "/login", "/style.css"];
  if (!req.session.user && !publicPaths.includes(req.path)) {
    return res.redirect("/login.html");
  }
  next();
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Simple hardcoded users for demo
  const users = {
    admin: { password: "adminpass", role: "admin" },
    guest: { password: "guestpass", role: "guest" },
  };
  if (users[username] && users[username].password === password) {
    req.session.user = { username, role: users[username].role };
    res.json({ success: true, role: users[username].role });
  } else {
    res.json({ success: false, message: "Invalid username or password" });
  }
});

// Logout endpoint
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// Booking submission endpoint
app.post("/booking", (req, res) => {
  const { name, phone, email, checkin, checkout } = req.body;
  if (!name || !phone || !email || !checkin || !checkout) {
    return res.json({ success: false, message: "Missing booking data" });
  }
  const stmt = db.prepare("INSERT INTO bookings (name, phone, email, checkin, checkout, status) VALUES (?, ?, ?, ?, ?, ?)");
  stmt.run(name, phone, email, checkin, checkout, "Pending", function (err) {
    if (err) {
      return res.json({ success: false, message: "Database error" });
    }
    res.json({ success: true, bookingId: this.lastID });
  });
  stmt.finalize();
});

// Admin bookings API (protected)
app.get("/admin/bookings", (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  db.all("SELECT * FROM bookings ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

// Serve admin.html only if admin logged in
app.get("/admin.html", (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/login.html");
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});