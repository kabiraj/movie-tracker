import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash, FaTrashAlt } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import '../styles/MoviesList.css'
import Footer from '../components/Footer'
import { API_BASE } from '../config'

// shows the movies you saved. we load them from the backend when the page opens. you can delete from here.
function MoviesListPage() {
    const [movies, setMovies] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if(!token) {
            navigate('/login')
        }
        
        const fetchedMovies = async () => {
            const response = await fetch(API_BASE + '/movies', {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })

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
        
        if (token) {
            fetchedMovies()
        }
    }, [navigate, token])

    const handleDeleteBtn = async (movieId) => {
        try {
            const response = await fetch(`${API_BASE}/movies/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })

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
                <div className='movie-grid'>
                    {
                        movies.map((movie) => (
                            <div key={movie._id} className='movie-details'>
                                <img 
                                    src={movie.poster}
                                    onClick={() => navigate(`/movies/details/${movie.movieId}`)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span className='movie-title'>{movie.title}</span>
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