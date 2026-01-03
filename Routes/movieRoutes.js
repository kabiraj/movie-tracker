import express from 'express';

const router = express.Router();

let moviesId = 1;
let movies = [
    { id: moviesId++, title: " Movie A"},
    { id: moviesId++, title: " Movie B"},
    { id: moviesId++, title: " Movie C"},
    { id: moviesId++, title: " Movie D"},
    { id: moviesId++, title: " Movie E"},
]

router.get("/", (req, res) => {
    res.json(movies);
}
);

router.get("/search", async (req,res) => {
    const searchQuery = req.query.query;
    const TMDB_API_KEY = process.env.TMDB_API_KEY?.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    const tmdb_api_request = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}`;

    const response = await fetch(tmdb_api_request);
    const data = await response.json();
    
    res.json(data);
});

router.get("/:id", (req,res)=> {
    const movieId = parseInt(req.params.id);
    const fetchedMovie = movies.find(movie => movie.id === movieId);
    if(fetchedMovie === undefined){
        res.status(404).send("Movie not found");
        return;
    }else {
        res.json(fetchedMovie);
        return;
    }
});




router.post("/", (req, res) => {
    if(!req.body){
        res.status(400).send("Empty Json body");
        return
    } else {
        const movieTitle = req.body.title;
        if(typeof movieTitle != 'string' || !movieTitle) {
            res.status(400).send("Invalid movie title")
            return;
        } else {
            const newMovie = { id:moviesId++, title: movieTitle};
            movies.push(newMovie);
            res.json(movies);
            return;
        }
    }
    
});

router.delete("/", (req, res) => {
    const movieToDeleteId = req.body.id;
    const idToDelete = parseInt(movieToDeleteId);
    movies = movies.filter(movie => movie.id !== idToDelete);
    res.json(movies);
});

router.put("/:id", (req, res) => {
    if(!req.body){
        res.status(400).send("Empty Json body");
        return;
    } else {
        const movieId = parseInt(req.params.id);
        const movieToUpdate = movies.findIndex( movie => movie.id === movieId);
        if(movieToUpdate === -1){
            res.status(404).send("Movie not found");
            return;
        }else {
            movies[movieToUpdate].title = req.body.title;
            res.json(movies);
            return;
        }
    }
    
});


export default router;