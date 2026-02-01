import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

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
        
                if(!response.ok) {
                    setLoading(false)
                    return
                } 
                const data = await response.json()
                setMovie(data)
                setLoading(false)
            } catch (error) {
                console.log('error: ', error)
                setLoading(false)
            }
            
        }

        fetchMovieDetails()
    }, [movieId, token])

    return (
        <div className='movie-detail-page'>
            <Navbar />
                {
                loading? (<p>Loading...</p>)
                : movie? (
                    <div className='movie-details-container'
                        style={{'--backdrop-url': `url(${movie.backdrop})`}}
                    > 
                        <div className='movie-details-header'>
                            {movie.logo ? <img src={movie.logo}/> : <h1>{movie.title}</h1>}
                            <p>{movie.overview}</p>
                        </div>
                    </div>
                )
                : (
                    <p>Movie not found</p>
                )}
            </div>
    )
}

export default MovieDetailsPage