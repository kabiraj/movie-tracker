import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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
                loading? (
                    <div className='loading-container' role="status" aria-live="polite" aria-busy="true">
                        <div className="loading-spinner" aria-hidden="true" />
                        <p>Loading...</p>
                    </div>
                )
                : movie? (
                    <>
                        <div className='movie-details-hero'
                            style={{'--backdrop-url': `url(${movie.backdrop})`}}
                            > 
                            <div className='movie-details-header'>
                                {movie.logo ? <img src={movie.logo}/> : <h1>{movie.title}</h1>}
                            </div>
                        </div>

                        <div className='movie-details-body'>
                            <div className='movie-details-info'>
                                <span className='movie-details-meta-data'>{`IMDB ${movie.vote_average}/10`}</span>
                                <span className='movie-details-seperator'>|</span>
                                <span className='movie-details-meta-data'>{movie.year}</span>
                                <span className='movie-details-seperator'>|</span>
                                <span className='movie-details-meta-data'>{hourMinuteFormater(movie.runtime)}</span>
                                <span className='movie-details-seperator'>|</span>
                                <span className='movie-details-meta-data'>{movie.original_language}</span>
                                <span className='movie-details-seperator'>|</span>
                                <span className='movie-details-meta-data'>{movie.genres?.slice(0,3).map(g => g.name).join(' , ')}</span>
                            </div>

                            <div className='movie-details-overview'>
                                <p>{movie.overview}</p>
                            </div>

                            <button onClick ={() => {handleAddToWatchList(movie.id)}}
                                    disabled={status === 'loading' || status === 'success' }
                                > 
                                    {
                                        status === 'loading'?
                                        'Adding...'
                                        : status === 'success'?
                                        '✓ Added'
                                        : status === 'error'?
                                        'Try again'
                                        :'+ Add to WatchList'
                                    }
                                </button>
                        </div>

                        <div className='movie-details-cast-container'>
                            <h1>Top cast</h1>
                            <div className='movie-detail-cast-grid'>
                                {movie.cast?.map(person => (
                                    person.profile_path && (
                                        <div key={person.id} className='cast-card'>
                                            <img 
                                                src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                                            />
                                            <span className='cast-name'>{person.name}</span>
                                            <span className='cast-role'>{person.character}</span>
                                        </div>
                                    )
                                ))}
                            </div>

                            <div className='movie-details-extra'>
                                <div className='extra-info-card'>
                                    <span className='extra-info-label'>Director</span>
                                    <span className='extra-info-value'>{movie.director}</span>
                                </div>
                                <div className='extra-info-card'>
                                    <span className='extra-info-label'>Writer</span>
                                    <span className='extra-info-value'>{movie.writer?.map(w => (w.name)).join(', ')}</span>
                                </div>
                                <div className='extra-info-card'>
                                    <span className='extra-info-label'>Budget</span>
                                    <span className='extra-info-value'>{`$${movie.budget.toLocaleString()}`}</span>
                                </div>
                                <div className='extra-info-card'>
                                    <span className='extra-info-label'>Box Office</span>
                                    <span className='extra-info-value'>{`$${movie.revenue.toLocaleString()}`}</span>
                                </div>
                                <div className='extra-info-card extra-info-card-wide'>
                                    <span className='extra-info-label'>Production Companies</span>
                                    <span className='extra-info-value'>{movie.production_companies?.map(p => (p.name)).join(', ')}</span>
                                </div>
                            </div>

                            {movie.trailer && (
                                <>
                                    <h1 className="trailer-label">Trailer</h1>

                                    <div className='movie-trailer'>
                                        <div className='movie-trailer-screen'>
                                            <iframe
                                                src={`https://www.youtube.com/embed/${movie.trailer}`}
                                                title={`${movie.title} trailer`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            /> 
                                        </div>

                                        <div className="movie-trailer-seats">
                                            <div className="seat-row seat-row-back">
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                            </div>
                                            <div className="seat-row seat-row-middle">
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                            </div>
                                            <div className="seat-row seat-row-front">
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                                <div className="seat" />
                                            </div>
                                        </div>
                                    </div> 
                                </>
                            )}
                        </div>
                        
                    </>
                )
                : (
                    <p>Movie not found</p>
                )
            }

            <Footer/>
        </div>
    )
}

export default MovieDetailsPage
