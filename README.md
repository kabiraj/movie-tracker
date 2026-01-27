# Movie Tracker App

A full-stack movie tracking app where you can search for movies, save them to your watchlist, and manage your collection. Built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.

## Features

- 🔐 **User Authentication** - Sign up and log in with JWT tokens
- 🔍 **Movie Search** - Search movies using TMDb API
- ❤️ **Watchlist** - Add movies to your personal watchlist with a heart icon
- 🗑️ **Delete Movies** - Remove movies from your watchlist
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 🔒 **Protected Routes** - JWT-based authentication for secure access
- 📱 **Responsive** - Works on desktop and mobile

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **CSS** - Custom styling with glassmorphism effects

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

### External APIs
- **TMDb API** - Movie data and search

## Project Structure

```
movie-tracker-app/
├── backend/
│   ├── Routes/
│   │   ├── movieRoutes.js    # Movie endpoints
│   │   └── userRoutes.js     # Auth endpoints
│   ├── models/
│   │   ├── Movie.js          # Movie schema
│   │   └── User.js           # User schema
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── db.js                 # MongoDB connection
│   ├── server.js             # Express server
│   └── .env                  # Environment variables
└── frontend/
    ├── src/
    │   ├── components/       # Navbar, Footer
    │   ├── pages/            # Login, Signup, Search, MoviesList
    │   ├── styles/           # CSS files
    │   └── App.jsx           # Main app component
    └── package.json
```

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- TMDb API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie-tracker-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Start the frontend dev server:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173` (or similar)

## API Endpoints

### Authentication

#### Signup
```http
POST /users/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Returns a JWT token in `passwordToken` field.

### Movie Endpoints

All movie endpoints require authentication. Include the JWT token:
```
Authorization: Bearer <your_jwt_token>
```

#### Get User's Watchlist
```http
GET /movies
Authorization: Bearer <token>
```

Returns array of movies in user's watchlist.

#### Search Movies
```http
GET /movies/search?query=inception
Authorization: Bearer <token>
```

Returns TMDb search results.

#### Get Movie Details
```http
GET /movies/details/:movieId
Authorization: Bearer <token>
```

Example: `GET /movies/details/155` (TMDb movie ID)

#### Add Movie to Watchlist
```http
POST /movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "movieId": "155"
}
```

Uses TMDb movie ID (numeric).

#### Delete Movie from Watchlist
```http
DELETE /movies/:id
Authorization: Bearer <token>
```

Uses MongoDB `_id` (not TMDb movieId).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `TMDB_API_KEY` | TMDb API key | Yes |

## Development

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will proxy API requests to `http://localhost:3000`.

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

Build output goes to `frontend/dist/`.

**Backend:**
```bash
cd backend
npm start
```

## How It Works

1. **Signup/Login** - Users create accounts and get JWT tokens
2. **Search** - Search for movies using TMDb API
3. **Add to Watchlist** - Click heart icon to save movies
4. **View Watchlist** - See all saved movies on Profile page
5. **Delete** - Remove movies from watchlist

The app stores movie data from TMDb in MongoDB, so you can access your watchlist even if TMDb is down (though you'll need it for searching).

## Notes

- TMDb movie IDs are numeric (e.g., `155` for The Dark Knight)
- MongoDB uses `_id` for documents, TMDb uses `movieId` for movies
- JWT tokens expire after 1 hour
- Movies are unique per user (can't add same movie twice)

## License

ISC

## Author

Kabiraj
