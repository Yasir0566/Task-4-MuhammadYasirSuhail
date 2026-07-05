# Task-4-MuhammadYasirSuhail

A small full-stack movie watchlist app with a plain HTML/CSS/JavaScript
frontend and an Express + SQLite backend. It was built to demonstrate
frontend-backend integration in a simple, working project.

## What it does

You can add movies to a watchlist, mark them as watched, and delete them.
Every action sends a real HTTP request to the backend, which saves the data
to a database so it persists across refreshes and restarts.

## Project structure

```
movie-watchlist/
├── backend/
│   ├── server.js
│   ├── routes/movieRoutes.js
│   ├── controllers/movieController.js
│   └── db/database.js
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Setup

1. Open a terminal in the backend folder.
2. Run `npm install`.
3. Start the backend with `npm start`.
4. Open the frontend in a browser to use the app.

The backend runs on `http://localhost:3000` and the frontend communicates
with it through fetch requests.
