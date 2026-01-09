import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

// GET /movies?userId=<user_id>
// Query parameter: userId (required) - the user ID to fetch movies for
// Returns: Array of all movie objects for the user
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find({userId: req.query.userId});
        res.json(movies);
        return;
    } catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
});

// GET /movies/search?query=<movie_name>
// Searches for movies using OMDB API
// Query parameter: query (required) - the movie name to search for
// Returns: OMDB API search results (array of movie objects from external API)
router.get("/search", async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const OMDB_API_KEY = process.env.OMDB_API_KEY;

        if(!searchQuery){
            return res.status(400).json({ error: "Search query is required" });
        }

        const encodedQuery = encodeURIComponent(searchQuery);
        const omdbUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodedQuery}`;

        const response = await fetch(omdbUrl);
        const data = await response.json();

        // OMDB uses Response: "False" to indicate no results found
        if(data.Response === "False"){
            return res.status(404).json({ error: data.Error || "Movie not found in OMDB" });
        }

        res.json(data);
        return;
    } catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
});

// GET /movies/details/:imdbId
// Fetches details of a movie by imdbId from the OMDB API
// Request parameter: imdbId (required) - the imdbId of the movie to fetch details for
// Returns: Entire movie object from OMDB API
router.get("/details/:imdbId", async (req, res) => {
    try {
        const imdbId = req.params.imdbId;
        const OMDB_API_KEY = process.env.OMDB_API_KEY;
        const encodedImdbId = encodeURIComponent(imdbId);
        const omdbUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodedImdbId}`;

        const response = await fetch(omdbUrl);
        const data = await response.json();

        if(data.Response === "False"){
            res.status(404).json({ error: data.Error });
            return;
        } else {
            res.json(data);
            return;
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// POST /movies
// Creates a new movie by fetching from OMDB API and saving to database
// Request body: { "title": "Movie Title", "userId": "user_id" }
// Returns: Created movie object with all OMDB data
router.post("/", async (req, res) => {
    try {
        const {imdbId, userId} = req.body;

        if(!imdbId || !userId){
            return res.status(400).json({ error: "imdbId and userId are required" });
        }

        const OMDB_API_KEY = process.env.OMDB_API_KEY;
        const encodedImdbId = encodeURIComponent(imdbId);
        const omdbUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodedImdbId}`;

        const response = await fetch(omdbUrl);
        const data = await response.json();

        // OMDB returns error if movie not found
        if (data.Response === "False") {
            return res.status(404).json({ error: data.Error || "Movie not found in OMDB" });
        }

        // Save all movie data from OMDB to database
        const movie = await Movie.create({
            title: data.Title,
            imdbID: data.imdbID,
            userId: userId,
            year: data.Year,
            rated: data.Rated,
            released: data.Released,
            runtime: data.Runtime,
            genre: data.Genre,
            director: data.Director,
            writer: data.Writer,
            actors: data.Actors,
            plot: data.Plot,
            language: data.Language,
            country: data.Country,
            awards: data.Awards,
            poster: data.Poster,
            ratings: data.Ratings,
            metascore: data.Metascore,
            imdbRating: data.imdbRating,
            imdbVotes: data.imdbVotes,
            type: data.Type,
            boxOffice: data.BoxOffice,
            production: data.Production,
            watchedDate: Date.now()
        });
        res.status(201).json(movie);
        return;
    } catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
});


//Delete/movies/:id
//Deletes a movie by movie id from the database
//returns a success message if the movie is deleted successfully

router.delete("/:id", async (req, res) => {
    try {
        const movieId = req.params.id;

        const deletedMovie = await Movie.findByIdAndDelete(movieId);
        if(!deletedMovie) {
            return res.status(404).json({ error: "Movie not found"});
        } else {
            res.status(200).json({message: "Movie deleted successfully"});
            return;
        }
        
    } catch (error) {
        res.status(500).json({error: error.message});
        return;
    }
} );
export default router;