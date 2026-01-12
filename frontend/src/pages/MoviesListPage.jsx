import { useEffect, useState } from 'react'

function MoviesListPage() {
    const [movies, setMovies] = useState([])

    useEffect (() => {
        const fetchedMovies = async () => {
            const token = localStorage.getItem('token')

            const response = await fetch('http://localhost:3000/movies', {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
                
            })

            const data = await response.json()
            setMovies(data)
        }
        fetchedMovies()
    }, [])

    return (
        <div>
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