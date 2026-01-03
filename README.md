# Movie Tracker Backend API

A full-stack Movie Tracker application backend built with Node.js and Express.

## Features

- ✅ CRUD operations for movies (Create, Read, Update, Delete)
- ✅ TMDB API integration for movie search
- ✅ Input validation and error handling
- ✅ Modular route structure

## Tech Stack

- Node.js
- Express.js
- TMDB API

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```
   TMDB_API_KEY=your_tmdb_api_key_here
   ```
4. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints

### Movies
- `GET /movies` - Get all movies
- `GET /movies/:id` - Get a specific movie by ID
- `GET /movies/search?query=<movie_name>` - Search movies via TMDB API
- `POST /movies` - Add a new movie
- `PUT /movies/:id` - Update a movie
- `DELETE /movies` - Delete a movie

## Project Structure

```
learnBackEnd/
├── Routes/
│   └── movieRoutes.js    # Movie-related routes
├── server.js              # Main server file
├── package.json           # Dependencies
└── .env                   # Environment variables (not in git)
```

