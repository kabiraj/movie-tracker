import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MoviesListPage() {
    const [movies, setMovies] = useState([])
    const navigate = useNavigate()

        const fetchedMovies = async () => {
            const token = localStorage.getItem('token')

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

    return (
        <div>
            <Navbar />
            <h1>Movies List</h1>
            {
                movies.map((movie) => (
                    <div key={movie._id}>
                        <h3>{movie.title}</h3>
                        <p>{movie.year}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default MoviesListPage