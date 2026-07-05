const db = require("../db/database");

// Kept separate from the route handlers below so each handler stays
// focused on request/response logic instead of mixing in data checks.
function validateMovieInput(title) {
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return "Title is required and must be a non-empty string.";
  }

  return null; // no errors
}

function getAllMovies(req, res) {
  const movies = db.prepare("SELECT * FROM movies").all();
  res.status(200).json(movies);
}

function createMovie(req, res) {
  const { title, genre } = req.body;

  const validationError = validateMovieInput(title);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const insertMovie = db.prepare(
    "INSERT INTO movies (title, genre, watched) VALUES (?, ?, 0)"
  );
  const result = insertMovie.run(title.trim(), genre ? genre.trim() : null);

  const newMovie = db
    .prepare("SELECT * FROM movies WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(newMovie);
}

function updateMovie(req, res) {
  const id = Number(req.params.id);
  const { title, genre, watched } = req.body;

  const existingMovie = db.prepare("SELECT * FROM movies WHERE id = ?").get(id);
  if (!existingMovie) {
    return res.status(404).json({ error: "Movie not found." });
  }

  // Only validate the title if the request is actually trying to change
  // it, so a small update like "mark as watched" doesn't fail for no reason.
  if (title !== undefined) {
    const validationError = validateMovieInput(title);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
  }

  const updatedValues = {
    title: title !== undefined ? title.trim() : existingMovie.title,
    genre: genre !== undefined ? genre.trim() : existingMovie.genre,
    watched: watched !== undefined ? (watched ? 1 : 0) : existingMovie.watched,
  };

  db.prepare(
    "UPDATE movies SET title = ?, genre = ?, watched = ? WHERE id = ?"
  ).run(updatedValues.title, updatedValues.genre, updatedValues.watched, id);

  const updatedMovie = db.prepare("SELECT * FROM movies WHERE id = ?").get(id);
  res.status(200).json(updatedMovie);
}

function deleteMovie(req, res) {
  const id = Number(req.params.id);

  const result = db.prepare("DELETE FROM movies WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Movie not found." });
  }

  res.status(204).send();
}

module.exports = {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
};
