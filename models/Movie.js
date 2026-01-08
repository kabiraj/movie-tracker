import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    // Basic info
    title: {
        type: String,
        required: true
    },
    imdbID: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    watchedDate: {
        type: Date,
        default: Date.now
    },
    // OMDB movie data
    year: String,
    rated: String,
    released: String,
    runtime: String,
    genre: String,
    director: String,
    writer: String,
    actors: String,
    plot: String,
    language: String,
    country: String,
    awards: String,
    poster: String,
    ratings: Array, // Array of rating objects
    metascore: String,
    imdbRating: String,
    imdbVotes: String,
    type: String,
    boxOffice: String,
    production: String
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;