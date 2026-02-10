import mongoose from 'mongoose';

/**
    Movie Schema
    Defines the structure of movie documents in MongoDB
 * 
 * Key fields:
 * - movieId: TMDb movie ID (not MongoDB _id)
 * - userId: Links movie to specific user
 * - watchedDate: When user added movie to watchlist
 * - fullTmdbData: Stores complete TMDb API response for future detail pages
 * 
 * Unique Index: Prevents same user from adding same movie twice
 * Index on { userId: 1, movieId: 1 } ensures one movie per user
 */
const movieSchema = new mongoose.Schema({
    // Basic info
    title: {
        type: String,
        required: true
    },
    // TMDb movie ID (numeric string like "546554")
    // Different from MongoDB _id which is auto-generated
    movieId: {
        type: String,
        required: true
    },
    // User ID from JWT token - links movie to specific user
    userId: {
        type: String,
        required: true
    },
    // Date when user added movie to watchlist
    watchedDate: {
        type: Date,
        default: Date.now
    },
    // TMDb movie data - all stored as strings for consistency
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
    poster: String, // Full TMDb poster URL
    ratings: Array,
    metascore: String,
    vote_average: String, // TMDb rating
    vote_count: String, // Number of TMDb votes
    type: String,
    boxOffice: String,
    production: String,
    // Full TMDb data for detail pages
    // Stores entire TMDb API response as JSON
    // Useful for future detail page features without re-fetching
    fullTmdbData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

/**
 * Unique Compound Index
 * Prevents duplicate movies per user
 * Example: User can't add "Knives Out" (movieId: "546554") twice
 * But different users can both add the same movie
 * 
 * If duplicate is attempted, MongoDB throws error code 11000
 */
movieSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Movie = mongoose.model('Movie', movieSchema);


export default Movie;