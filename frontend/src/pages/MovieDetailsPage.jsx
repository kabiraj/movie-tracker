import { useParams } from 'react-router-dom'
import '../styles/MovieDetails.css'

function MovieDetailsPage() {

    const { movieId } = useParams()

    return (
        <div className='movie-detail-page'>
            <div className='movie-detail-container'>
                <h1>Movie detail page</h1>
                <p>Movie ID: {movieId}</p>
            </div>
        </div>
    )
}

export default MovieDetailsPage