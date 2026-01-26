import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/MoviesList.css'
import Footer from '../components/Footer'

function MoviesListPage() {
    const [movies, setMovies] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        
        if(!token) {
            navigate('/login')
        }
        const fetchedMovies = async () => {

            const response = await fetch('http://localhost:3000/movies', {
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

            const data = await response.json()
            setMovies(data)
        }
        fetchedMovies()

    }, [navigate, token])

    return (
        <div className="movies-page">
            <Navbar />
            <div className='movie-container'>
                <h1>Movies List</h1>
                <div className='movie-grid'>
                    {
                        movies.map((movie) => (
                            <div key={movie._id}>
                                <img src={movie.poster}/>
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