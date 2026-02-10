import mongoose from 'mongoose';

// what one saved movie looks like in the database. movieId is from TMDb, userId ties it to a user. fullTmdbData is the raw response so we can show details without calling TMDb again.
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    movieId: {
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
    ratings: Array,
    metascore: String,
    vote_average: String,
    vote_count: String,
    type: String,
    boxOffice: String,
    production: String,
    fullTmdbData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

// one user can't save the same movie twice. if they try, mongo gives error 11000
movieSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Movie = mongoose.model('Movie', movieSchema);


export default Movie;
