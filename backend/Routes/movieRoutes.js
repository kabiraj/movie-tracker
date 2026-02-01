import express from 'express';
import Movie from '../models/Movie.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /movies
 * Fetches all movies for the authenticated user
 * 
 * Authentication: Requires valid JWT token in Authorization header
 * - Token is verified by authenticateToken middleware
 * - req.userId is set by middleware from decoded token
 * 
 * Returns: Array of all movie objects belonging to the user
 * - Empty array if user has no movies
 */
router.get("/", authenticateToken, async (req, res) => {
    try {
        // Find all movies where userId matches authenticated user
        // req.userId comes from authenticateToken middleware
        const movies = await Movie.find({userId: req.userId});
        res.json(movies);
        return;
    } catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
});

/**
 * GET /movies/search?query=<movie_name>
 * Searches for movies using TMDb API
 * 
 * Authentication: Requires valid JWT token
 * Query parameter: query (required) - the movie name to search for
 * 
 * Process:
 * 1. Validates search query exists
 * 2. Encodes query for URL (handles special characters)
 * 3. Calls TMDb search API
 * 4. Transforms results to include full poster URLs
 * 5. Returns array of movie objects
 * 
 * Returns: { results: [...] } - Array of movie objects from TMDb
 * - poster_path is transformed to full URL (https://image.tmdb.org/...)
 * - Returns 404 if no results found
 */
router.get("/search", authenticateToken, async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

        if(!searchQuery){
            return res.status(400).json({ error: "Search query is required" });
        }

        // encodeURIComponent handles special characters in search query
        // Example: "Knives Out" becomes "Knives%20Out"
        const encodedQuery = encodeURIComponent(searchQuery);
        const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}`;

        const response = await fetch(tmdbUrl);
        const data = await response.json();
        
        if(data.results && data.results.length === 0){
            return res.status(404).json({ error: "Movie not found in TMDb" });
        }

        // Transform TMDb results to include full poster URLs
        // TMDb returns relative paths like "/pThyQovXQrw2m0s9x82twj48Jq4.jpg"
        // We convert to full URL: "https://image.tmdb.org/t/p/w500/..."
        const transformedResults = data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            poster_path: movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : null,
            overview: movie.overview,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count
        }));

        res.json({ results: transformedResults });
        return;
    } catch (error) {
        res.status(500).json({ error: error.message });
        return;
    }
});


/**
 * GET /movies/details/:movieId
 * Fetches detailed information about a specific movie from TMDb API
 * 
 * Authentication: Requires valid JWT token
 * URL parameter: movieId - TMDb movie ID 
 * 
 * Process:
 * 1. Extracts movieId from URL params
 * 3. Fetches movie details + credits from TMDb
 * 4. Transforms response to include full poster URL and formatted data
 * 
 * Returns: Movie object with full details including cast, crew, genres
 * - Returns 404 if movie not found in TMDb
 */
router.get("/details/:movieId", authenticateToken, async (req, res) => {
    try {
        let movieId = req.params.movieId;
        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        

        // append_to_response=credits fetches cast and crew in same request
        const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,images`;

        const response = await fetch(tmdbUrl);
        const data = await response.json();
        
        // TMDb returns status_code if movie not found
        if(data.status_code || !data.id){
            res.status(404).json({ error: data.status_message || "Movie not found" });
            return;
        } else {
            // Transform TMDb response to include full poster URL
            // Extract director from crew array
            // Limit cast to top 5 actors
            const movieData = {
                id: data.id,
                title: data.title,
                release_date: data.release_date,
                logo: data.images?.logos?.find(logo => logo.iso_639_1 === 'en')?.file_path
                        ? `https://image.tmdb.org/t/p/original${data.images.logos.find(logo => logo.iso_639_1 === 'en').file_path}`
                        : null,
                backdrop: data.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` 
                    : null,
                poster: data.poster_path
                    ? `https://image.tmdb.org/t/p/original${data.poster_path}` 
                    : null,
                overview: data.overview,
                genres: data.genres,
                director: data.credits?.crew?.find(c => c.job === 'Director')?.name || null,
                runtime: data.runtime,
                original_language: data.original_language,
                vote_average: data.vote_average,
                vote_count: data.vote_count,
                cast: data.credits?.cast?.slice(0, 9) || [], 
                crew: data.credits?.crew || [],
                production_countries: data.production_countries,
                production_companies: data.production_companies,
                revenue: data.revenue
            };
            res.json(movieData);
            return;
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


/**
 * POST /movies
 * Adds a movie to user's watchlist
 * 
 * Authentication: Requires valid JWT token (userId extracted from token)
 * Request body: { "movieId": "123" } - TMDb movie ID
 * 
 * Process:
 * 1. Validates movieId exists in request
 * 2. Handles "tmdb-123" format if present
 * 3. Fetches full movie details from TMDb API
 * 4. Checks if movie already exists for this user (prevents duplicates)
 * 5. Transforms TMDb data to match database schema
 * 6. Saves movie to database with userId
 * 7. Stores full TMDb response in fullTmdbData field
 * 
 * Returns: Created movie object (201) or error
 * - 409 Conflict if movie already in user's watchlist
 * - 404 if movie not found in TMDb
 */
router.post("/", authenticateToken, async (req, res) => {
    try {
        let {movieId} = req.body;
        const userId = req.userId; // From authenticateToken middleware

        if(!movieId){
            return res.status(400).json({ error: "movieId is required" });
        }

        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        
        // Handle "tmdb-123" format by extracting numeric ID
        if (movieId.toString().startsWith('tmdb-')) {
            movieId = movieId.toString().replace('tmdb-', '');
        }

        // Fetch movie details + credits from TMDb
        const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
        const response = await fetch(tmdbUrl);
        const data = await response.json();

        // TMDb returns error if movie not found
        if (data.status_code || !data.id) {
            return res.status(404).json({ error: data.status_message || "Movie not found in TMDb" });
        }

        // Check if movie already exists for this user
        // Prevents duplicate entries (also enforced by unique index)
        const movieIdString = data.id.toString();
        const existingMovie = await Movie.findOne({ userId: userId, movieId: movieIdString });
        
        if (existingMovie) {
            return res.status(409).json({ error: "Movie already saved" });
        }

        // Transform TMDb data to match database schema
        // Extract year from release_date (format: "2019-11-27" -> "2019")
        // Extract director from crew array (person with job === 'Director')
        // Extract top 5 actors from cast array
        // Format revenue with commas ($312,897,920)
        // Store full TMDb response for future detail pages
        const movie = await Movie.create({
            title: data.title,
            movieId: movieIdString,
            userId: userId,
            year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
            rated: 'N/A',
            released: data.release_date || 'N/A',
            runtime: data.runtime ? `${data.runtime} min` : 'N/A',
            genre: data.genres ? data.genres.map(g => g.name).join(', ') : 'N/A',
            director: data.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A',
            writer: data.credits?.crew?.filter(c => c.job === 'Writer' || c.job === 'Screenplay').map(c => c.name).join(', ') || 'N/A',
            actors: data.credits?.cast?.slice(0, 5).map(a => a.name).join(', ') || 'N/A',
            plot: data.overview || 'N/A',
            language: data.original_language || 'N/A',
            country: data.production_countries?.map(c => c.name).join(', ') || 'N/A',
            awards: 'N/A',
            poster: data.poster_path 
                ? `https://image.tmdb.org/t/p/w500${data.poster_path}` 
                : 'N/A',
            ratings: [],
            metascore: 'N/A',
            vote_average: data.vote_average ? data.vote_average.toString() : 'N/A',
            vote_count: data.vote_count ? data.vote_count.toString() : 'N/A',
            type: 'movie',
            boxOffice: data.revenue ? `$${data.revenue.toLocaleString()}` : 'N/A',
            production: data.production_companies?.map(c => c.name).join(', ') || 'N/A',
            watchedDate: Date.now(),
            // Store full TMDb response for detail pages
            // Allows access to all TMDb data without re-fetching
            fullTmdbData: data
        });
        return res.status(201).json(movie);
    } catch (error) {
        // MongoDB duplicate key error (error code 11000)
        // Triggered by unique index on { userId: 1, movieId: 1 }
        // This is a backup check (we also check before creating)
        if (error?.code === 11000) {
            return res.status(409).json({ error: "Movie already saved" });
        }
        res.status(500).json({ error: error.message });
        return;
    }
});


/**
 * DELETE /movies/:id
 * Deletes a movie from user's watchlist
 * 
 * Authentication: Requires valid JWT token
 * URL parameter: id - MongoDB _id of the movie document (not TMDb movieId)
 * 
 * Security:
 * - Only deletes if movie belongs to authenticated user
 * - findOneAndDelete with userId check prevents users from deleting others' movies
 * 
 * Returns: Success message (200) or error
 * - 404 if movie not found or doesn't belong to user
 */
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const movieId = req.params.id; // MongoDB _id, not TMDb movieId

        // findOneAndDelete only deletes if both conditions match:
        // 1. _id matches the provided ID
        // 2. userId matches authenticated user
        // This ensures users can only delete their own movies
        const deletedMovie = await Movie.findOneAndDelete(
            { 
                _id: movieId,
                userId: req.userId // From authenticateToken middleware
            }
        );
        
        if(!deletedMovie) {
            // Movie not found or doesn't belong to user
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