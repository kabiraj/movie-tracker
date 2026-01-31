import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import '../styles/MovieDetails.css'

function MovieDetailsPage() {
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const { movieId } = useParams()
    const token = localStorage.getItem('token')


    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/movies/details/${movieId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
        
                if(response.ok) {
                    const data = await response.json()
                    setMovie(data)
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            } catch (error) {
                console.log('error: ', error)
                setLoading(false)
            }
            
        }

        fetchMovieDetails()
    }, [movieId, token])

    return (
        <div className='movie-detail-page'>
            <div className='movie-detail-container'>
                {loading? (<p>Loading...</p>): movie? (<div> {movie.overview}</div>): <p>Movie not found</p>}
            </div>
        </div>
    )
}

export default MovieDetailsPage