const express = require("express");
const movieRoutes = require("./routes/movieRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// The frontend for this project is just an HTML file that gets opened
// directly in the browser (not served by this backend). That means it
// runs on a different "origin" than this API, so without these headers
// the browser would block every request before it even reaches us.
function allowFrontendAccess(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browsers send a preflight OPTIONS request before certain requests
  // (like our JSON POST/PUT calls) to check permissions first. Answering
  // it immediately lets the browser know it's safe to send the real one.
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}

app.use(allowFrontendAccess);

// Simple health check route to confirm the server is alive.
app.get("/", (req, res) => {
  res.status(200).json({ message: "Movie Watchlist API is running." });
});

app.use("/api/movies", movieRoutes);

// Catch-all for routes that don't exist.
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
