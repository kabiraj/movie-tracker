import express from 'express';

const router = express.Router();

let moviesId = 1;
let movies = [
    { id: moviesId++, title: " Movie A"},
    { id: moviesId++, title: " Movie B"},
    { id: moviesId++, title: " Movie C"},
    { id: moviesId++, title: " Movie D"},
    { id: moviesId++, title: " Movie E"},
];

//Helper functions

//function to validate if the request body is present or not
function validateRequestBody(req, res) {
    if(!req.body){
        res.status(400).send("Empty Json body");
        return false;
    }else {
        return true;
    }
}

// function to find movies by id
function findMovieById(id){
    return movies.find(movie => movie.id === id);
}

// GET /movies
// Returns all movies in the in-memory array
// No parameters required
// Returns: Array of all movie objects
router.get("/", (req, res) => {
    res.json(movies);
}
);


// GET /movies/search?query=<movie_name>
// Searches for movies using TMDB API
// Query parameter: query (required) - the movie name to search for
// Returns: TMDB API search results (array of movie objects from external API)
router.get("/search", async (req,res) => {
    const searchQuery = req.query.query;
    const TMDB_API_KEY = process.env.TMDB_API_KEY?.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    const tmdb_api_request = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}`;

    const response = await fetch(tmdb_api_request);
    const data = await response.json();
    
    res.json(data);
});

// GET /movies/:id
// Returns a single movie by its ID
// URL parameter: id (required) - the movie ID to fetch
// Returns: Movie object if found, 404 error if not found
router.get("/:id", (req,res)=> {
    const movieId = parseInt(req.params.id);
    const fetchedMovie = findMovieById(movieId);
    if(fetchedMovie === undefined){
        res.status(404).send("Movie not found");
        return;
    }else {
        res.json(fetchedMovie);
        return;
    }
});




// POST /movies
// Creates a new movie and adds it to the in-memory array
// Request body: { "title": "Movie Title" } (title is required and must be a string)
// Returns: Updated array of all movies (including the new one)
// Validation: Checks if body exists and if title is valid string
router.post("/", (req, res) => {
    if (!validateRequestBody(req, res)) return;

        const movieTitle = req.body.title;

        if(typeof movieTitle != 'string' || !movieTitle) {
            res.status(400).send("Invalid movie title");
            return;
        } else {
            const newMovie = { id:moviesId++, title: movieTitle};
            movies.push(newMovie);
            res.json(movies);
            return;
        }
});

// DELETE /movies
// Deletes a movie from the in-memory array by ID
// Request body: { "id": 1 } (id is required)
// Returns: Updated array of all movies (without the deleted one)
// Note: This should ideally use DELETE /movies/:id (REST convention) - will fix later
router.delete("/:id", (req, res) => {
    const movieToDeleteId = req.params.id;
    const idToDelete = parseInt(movieToDeleteId);
        if(!findMovieById(idToDelete)){
            res.status(404).send("Movie not Found");
            return;
        } else {
            movies = movies.filter(movie => movie.id !== idToDelete);
            res.json(movies);
            return;
        }
});

// PUT /movies/:id
// Updates an existing movie's title by its ID
// URL parameter: id (required) - the movie ID to update
// Request body: { "title": "New Movie Title" } (title is required)
// Returns: Updated array of all movies, 404 if movie not found, 400 if body invalid
// Validation: Checks if body exists and if movie exists
router.put("/:id", (req, res) => {
        if (!validateRequestBody(req,res)) return;
        
        const movieId = parseInt(req.params.id);
        const movieToUpdate = findMovieById(movieId);

        if(movieToUpdate === undefined){
            res.status(404).send("Movie not found");
            return;
        }else {
            movieToUpdate.title = req.body.title;
            res.json(movies);
            return;
        }
});


export default router;