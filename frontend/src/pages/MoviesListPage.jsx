import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash, FaTrashAlt } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import '../styles/MoviesList.css'
import Footer from '../components/Footer'

/**
 * MoviesListPage Component
 * Displays user's saved watchlist movies
 * - Fetches all movies for the logged-in user on mount
 * - Displays movies in a responsive grid layout
 * - Allows users to delete movies from their watchlist
 */
function MoviesListPage() {
    // State to store user's saved movies from database
    const [movies, setMovies] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    /**
     * useEffect runs on component mount and when token/navigate changes
     * - Protects route by redirecting if no token
     * - Fetches all movies for the authenticated user
     * - Handles 401 (unauthorized) by redirecting to login
     */
    useEffect(() => {
        // Route protection: redirect if no token
        if(!token) {
            navigate('/login')
        }
        
        /**
         * Async function to fetch user's movies
         * Backend uses token to identify user and returns only their movies
         */
        const fetchedMovies = async () => {
            const response = await fetch('http://localhost:3000/movies', {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })

            // 401 = Token invalid or expired, redirect to login
            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login')
                    return
                }
            }

            // Backend returns array of movie objects
            const data = await response.json()
            setMovies(data)
        }
        
        // Only fetch if token exists
        if (token) {
            fetchedMovies()
        }
    }, [navigate, token])

    /**
     * Handles deleting a movie from watchlist
     * - Sends DELETE request with movie's MongoDB _id
     * - Backend verifies movie belongs to user before deleting
     * - Optimistically updates UI by filtering out deleted movie
     * - Uses movie._id (MongoDB ID) not movie.movieId (TMDb ID)
     */
    const handleDeleteBtn = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:3000/movies/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })

            // If deletion successful, remove movie from state immediately
            // This provides instant UI feedback without waiting for refetch
            if(response.ok){
                setMovies(movies.filter(movie => movie._id !== movieId))
            }
        } catch (error) {
            console.log('error; ', error)
        }
    }

    return (
        <div className="movies-page">
            <Navbar />
            <div className='movie-container'>
                <h1>Movies List</h1>
                {/* Responsive grid layout for movie posters */}
                <div className='movie-grid'>
                    {
                        movies.map((movie) => (
                            <div key={movie._id} className='movie-details'>
                                {/* Movie poster from TMDb (full URL stored in database) */}
                                <img 
                                    src={movie.poster}
                                    onClick={() => navigate(`/movies/details/${movie.movieId}`)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span className='movie-title'>{movie.title}</span>
                                {/* Delete button: uses movie._id (MongoDB ID) for deletion */}
                                <button onClick ={() => {handleDeleteBtn(movie._id)}}>
                                    <FaTrash></FaTrash>
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
            < Footer/>
        </div>
    )
}

export default MoviesListPage