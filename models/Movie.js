import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    tmdbId : {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    watchedDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;