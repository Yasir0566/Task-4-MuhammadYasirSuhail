// This is the backend server's address. Since the backend runs on
// port 3000 by default, that's what we call it on.
const API_BASE_URL = "http://localhost:3000/api/movies";

const movieForm = document.getElementById("movie-form");
const titleInput = document.getElementById("title-input");
const genreInput = document.getElementById("genre-input");
const movieList = document.getElementById("movie-list");
const statusMessage = document.getElementById("status-message");

// Load whatever is already saved as soon as the page opens.
loadMovies();

movieForm.addEventListener("submit", handleAddMovie);

// Fetches the current watchlist from the backend and displays it.
async function loadMovies() {
  showStatus("Loading your watchlist...");

  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error("The server responded with an error.");
    }

    const movies = await response.json();
    renderMovies(movies);
    clearStatus();
  } catch (error) {
    // This usually means the backend server isn't running, or CORS
    // is blocking the request. Either way, the user needs to know.
    showStatus("Couldn't load the watchlist. Is the backend server running?");
  }
}

// Runs when the "Add Movie" form is submitted.
async function handleAddMovie(event) {
  // Stops the browser from doing a full page reload on submit, which
  // would erase everything we're about to do with fetch().
  event.preventDefault();

  const title = titleInput.value.trim();
  const genre = genreInput.value.trim();

  if (title.length === 0) {
    showStatus("Please enter a movie title.");
    return;
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, genre }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Could not add the movie.");
    }

    titleInput.value = "";
    genreInput.value = "";
    clearStatus();
    loadMovies(); // refresh the list so the new movie shows up
  } catch (error) {
    showStatus(error.message);
  }
}

// Flips a movie between watched and not watched.
async function toggleWatched(id, currentlyWatched) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watched: !currentlyWatched }),
    });

    if (!response.ok) {
      throw new Error("Could not update this movie.");
    }

    loadMovies();
  } catch (error) {
    showStatus(error.message);
  }
}

async function deleteMovie(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Could not delete this movie.");
    }

    loadMovies();
  } catch (error) {
    showStatus(error.message);
  }
}

// Rebuilds the visible list from scratch based on the latest data.
// Simpler than tracking individual DOM changes, and fast enough for a
// list this size.
function renderMovies(movies) {
  movieList.innerHTML = "";

  if (movies.length === 0) {
    movieList.innerHTML =
      "<li class='empty-message'>Your watchlist is empty. Add a movie above.</li>";
    return;
  }

  movies.forEach((movie) => {
    const listItem = document.createElement("li");
    listItem.className = movie.watched ? "movie watched" : "movie";

    listItem.innerHTML = `
      <span class="movie-info">
        <strong>${escapeHtml(movie.title)}</strong>
        ${movie.genre ? " — " + escapeHtml(movie.genre) : ""}
      </span>
      <span class="movie-actions">
        <button class="watched-btn">${movie.watched ? "Mark unwatched" : "Mark watched"}</button>
        <button class="delete-btn">Delete</button>
      </span>
    `;

    listItem
      .querySelector(".watched-btn")
      .addEventListener("click", () => toggleWatched(movie.id, movie.watched));

    listItem
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteMovie(movie.id));

    movieList.appendChild(listItem);
  });
}

function showStatus(message) {
  statusMessage.textContent = message;
}

function clearStatus() {
  statusMessage.textContent = "";
}

// Movie titles come from user input and get inserted as HTML below, so
// this makes sure they're treated as plain text instead of markup —
// otherwise someone could type a <script> tag as a "title".
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
