import express from 'express';
import Movie from '../models/Movie.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// get all movies saved by this user (we know who they are from the token)
router.get("/", authenticateToken, async (req, res) => {
    try {
        const movies = await Movie.find({userId: req.userId});
        res.json(movies);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
        return;
    }
});

// search for movies by name using the TMDb api. we turn poster paths into full image urls.
router.get("/search", authenticateToken, async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

        if(!searchQuery){
            return res.status(400).json({ error: "Search query is required" });
        }

        const encodedQuery = encodeURIComponent(searchQuery);
        const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}`;

        const response = await fetch(tmdbUrl);
        const data = await response.json();
        
        if(data.results && data.results.length === 0){
            return res.status(404).json({ error: "Movie not found in TMDb" });
        }

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
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
        return;
    }
});


// get full details for one movie from TMDb (cast, trailer, etc). movieId in the url is the TMDb id.
router.get("/details/:movieId", authenticateToken, async (req, res) => {
    try {
        let movieId = req.params.movieId;
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

        const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,images,release_dates,videos`;

        const response = await fetch(tmdbUrl);
        const data = await response.json();

        if(data.status_code || !data.id){
            res.status(404).json({ error: data.status_message || "Movie not found" });
            return;
        }

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
            tagline: data.tagline || null,
            genres: data.genres,
            director: data.credits?.crew?.find(c => c.job === 'Director')?.name || null,
            runtime: data.runtime,
            original_language: data.original_language,
            vote_average: data.vote_average != null ? Number(data.vote_average).toFixed(1) : null,
            vote_count: data.vote_count ?? null,
            year: data.release_date? data.release_date.split('-')[0]: null,
            cast: data.credits?.cast?.slice(0, 9) || [], 
            crew: data.credits?.crew || [],
            writer: data.credits?.crew?.filter( c => c.job === 'Writer' || c.job === 'Screenplay') || [],
            production_countries: data.production_countries,
            production_companies: data.production_companies,
            revenue: data.revenue,
            budget: data.budget || null,
            trailer: data.videos?.results?.find(
                v => v.site === 'YouTube' && v.type === 'Trailer' && (v.name.includes('official') || v.name.includes('Trailer') || v.name.includes('final'))
            )?.key || null
        };
        res.json(movieData);
        return;

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});


// add a movie to this user's watchlist. body should have movieId (the TMDb id). we fetch the movie from TMDb then save it to our db.
router.post("/", authenticateToken, async (req, res) => {
    try {
        let {movieId} = req.body;
        const userId = req.userId;

        if(!movieId){
            return res.status(400).json({ error: "movieId is required" });
        }

        const TMDB_API_KEY = process.env.TMDB_API_KEY;
        
        if (movieId.toString().startsWith('tmdb-')) {
            movieId = movieId.toString().replace('tmdb-', '');
        }

        const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
        const response = await fetch(tmdbUrl);
        const data = await response.json();

        if (data.status_code || !data.id) {
            return res.status(404).json({ error: data.status_message || "Movie not found in TMDb" });
        }

        const movieIdString = data.id.toString();
        const existingMovie = await Movie.findOne({ userId: userId, movieId: movieIdString });
        
        if (existingMovie) {
            return res.status(409).json({ error: "Movie already saved" });
        }

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
            fullTmdbData: data
        });
        return res.status(201).json(movie);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ error: "Movie already saved" });
        }
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
        return;
    }
});


// delete a movie from this user's watchlist. the id in the url is the mongo _id of the movie document, not the TMDb id. we only delete if it belongs to this user.
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const movieId = req.params.id;

        const deletedMovie = await Movie.findOneAndDelete(
            { 
                _id: movieId,
                userId: req.userId
            }
        );
        
        if(!deletedMovie) {
            return res.status(404).json({ error: "Movie not found"});
        }
        res.status(200).json({message: "Movie deleted successfully"});
        return;
    } catch (error) {
        if (error?.name === 'CastError') {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
        return;
    }
} );
export default router;
