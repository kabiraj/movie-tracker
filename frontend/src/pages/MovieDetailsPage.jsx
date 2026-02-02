import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { AddToWatchList } from '../utils/AddToWatchList'

import '../styles/MovieDetails.css'

function MovieDetailsPage() {
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const { movieId } = useParams()
    const token = localStorage.getItem('token')
    const [ status, setStatus ] = useState('idle')


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

    const hourMinuteFormater = (totalMinutes) => {
        const hours = Math.floor(totalMinutes/ 60)
        const minutes = totalMinutes % 60
        
        if (hours > 0 && minutes > 0) {
            return( `${hours}h ${minutes}m`)
        } else if ( hours > 0 && minutes === 0) {
            return( `${hours}h`)
        } else if ( hours === 0) {
            return( `${minutes}m`)
        }
    }

    const handleAddToWatchList = async (movieId) => {
        setStatus('loading')
        const success = await AddToWatchList(movieId)
        setStatus(success? 'success': 'error')
    }
    return (
        <div className='movie-detail-page'>
            <Navbar />
            {
                loading? (<p>Loading...</p>)
                : movie? (
                    <>
                        <div className='movie-details-hero'
                            style={{'--backdrop-url': `url(${movie.backdrop})`}}
                        > 
                            <div className='movie-details-header'>
                                {movie.logo ? <img src={movie.logo}/> : <h1>{movie.title}</h1>}
                                <p>{movie.tagline}</p>
                                <button onClick ={() => {handleAddToWatchList(movie.id)}}
                                    disabled={status === 'loading' || status === 'success' }
                                > 
                                    {
                                        status == 'loading'?
                                        'Adding...'
                                        : status === 'success'?
                                        'Added'
                                        : status === 'error'?
                                        'Try again'
                                        :'+ Add to WatchList'
                                    }
                                </button>
                            </div>
                        </div>

                        <div className='movie-details-body'>
                            <h1>{movie.title}</h1>
                            <div className='movie-details-info'>
                                <p>{`IMDB ${movie.vote_average}/10`}</p>
                                <p>{movie.year}</p>
                                <p>{hourMinuteFormater(movie.runtime)}</p>
                                <p>{movie.genres?.map(g => g.name).join(' | ')}</p>
                                <p>{movie.original_language}</p>
                            </div>

                            <div className='movie-details-overview'>
                                <p>{movie.overview}</p>
                            </div>

                        </div>
                    </>
                )
                : (
                    <p>Movie not found</p>
                )
            }
        </div>
    )
}

export default MovieDetailsPage