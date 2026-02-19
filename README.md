# Movie Tracker App

A full-stack movie app where users can:
- create an account and log in
- search movies from TMDb
- view movie details (cast, runtime, trailer)
- save movies to a personal watchlist
- remove movies from the watchlist

## Tech Stack

Frontend:
- React + Vite
- React Router
- CSS

Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- TMDb API integration

## Project Structure

```text
movie-tracker-app/
  backend/
  frontend/
```

## Environment Variables

### Backend
Create `/backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

You already have a template at `/backend/.env.example`.

### Frontend
Create `/frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

You already have a template at `/frontend/.env.example`.

## Run Locally

### 1) Start backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`.

### 2) Start frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Routes (Backend)

User routes:
- `POST /users/signup`
- `POST /users/login`
- `GET /users/auth` (protected)

Movie routes (protected):
- `GET /movies`
- `GET /movies/search?query=...`
- `GET /movies/details/:movieId`
- `POST /movies`
- `DELETE /movies/:id`

## Deployment (Simple)

Backend (Render):
1. Set root directory to `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add backend env vars from `.env.example`

Frontend (Vercel):
1. Set root directory to `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add `VITE_API_URL=https://your-backend-url`

For React Router refresh support on Vercel, keep `/frontend/vercel.json` in the repo.

## Notes

- Do not commit real `.env` files.
- Rotate keys immediately if any secret was pushed to GitHub.
