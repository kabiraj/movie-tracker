# Movie Tracker App

A full-stack movie tracking application that allows users to search, save, and manage their movie watchlist. Built with Node.js, Express, and MongoDB on the backend, with React frontend (coming soon).

## Features

- 🔐 **User Authentication** - Secure signup and login with JWT tokens
- 🔍 **Movie Search** - Search movies using the OMDB API
- 📝 **Watchlist Management** - Save, view, and delete movies from your personal watchlist
- 🔒 **Protected Routes** - JWT-based authentication middleware for secure endpoints
- 🔐 **Password Security** - Bcrypt password hashing
- 🌐 **CORS Enabled** - Ready for frontend integration
- 💾 **Database Persistence** - MongoDB with Mongoose ODM

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **OMDB API** - Movie data and search functionality

## Project Structure

```
movie-tracker-app/
├── backend/
│   ├── Routes/
│   │   ├── movieRoutes.js    # Movie-related endpoints
│   │   └── userRoutes.js     # User authentication endpoints
│   ├── models/
│   │   ├── Movie.js          # Movie schema
│   │   └── User.js           # User schema
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── db.js                 # MongoDB connection
│   ├── server.js             # Express server setup
│   ├── package.json
│   └── .env                  # Environment variables (not in git)
└── frontend/                 # React frontend (coming soon)
```

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- OMDB API key ([Get one here](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie-tracker-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OMDB_API_KEY=your_omdb_api_key
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   Server will run on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

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

**Response:**
```json
{
  "message": "User created successfully",
  "user": { ... }
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

**Response:**
```json
{
  "message": "Login successful",
  "passwordToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Movie Endpoints

**Note:** All movie endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Movies (User's Watchlist)
```http
GET /movies
Authorization: Bearer <token>
```

**Response:** Array of movie objects

#### Search Movies
```http
GET /movies/search?query=inception
Authorization: Bearer <token>
```

**Response:** OMDB API search results

#### Get Movie Details
```http
GET /movies/details/:imdbId
Authorization: Bearer <token>
```

**Example:**
```http
GET /movies/details/tt1375666
Authorization: Bearer <token>
```

**Response:** Complete movie details from OMDB API

#### Add Movie to Watchlist
```http
POST /movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "imdbId": "tt1375666"
}
```

**Response:** Created movie object

#### Delete Movie from Watchlist
```http
DELETE /movies/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Movie deleted successfully"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Signup/Login** - Receive a JWT token
2. **Protected Routes** - Include token in request header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. **Token Expiration** - Tokens expire after 1 hour

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes |
| `OMDB_API_KEY` | API key for OMDB service | Yes |

## Development

### Running in Development Mode
```bash
cd backend
npm run dev
```
Uses `nodemon` for automatic server restart on file changes.

### Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload

## Future Enhancements

- [ ] React frontend implementation
- [ ] Movie rating and review features
- [ ] Watch status tracking (watched/plan to watch)
- [ ] Movie filtering and sorting
- [ ] User profiles
- [ ] Movie recommendations

## License

ISC

## Author

Kabiraj
