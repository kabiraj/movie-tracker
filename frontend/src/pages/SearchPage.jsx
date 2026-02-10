import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart} from 'react-icons/fa'
import '../styles/SearchPage.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { AddToWatchList } from '../utils/AddToWatchList'
import { API_BASE } from '../config'

// search for movies and add them to your list with the heart. we check the token first and redirect to login if not logged in.
function SearchPage() {
    const [keyword, setKeyword] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [addedMovies, setAddedMovies] = useState([])
    const [noResult, setNoResults] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if(!token) {
            navigate('/login')
            return
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`${API_BASE}/users/auth`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })

                if (!response.ok) {
                    localStorage.removeItem('token')
                    navigate('/login')
                }
                return
            } catch (error) {
                console.log('error: ', error)
                navigate('/login')
            }
        }
        verifyToken()
    }, [token, navigate])
    
    if (!token) {
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Clear previous results for new search
        setSearchResults([])
        setNoResults(false);
        // Don't search if input is empty or only whitespace
        if(!keyword.trim()){
            return
        }

        try {
            // Call backend search endpoint with query parameter
            const response = await fetch(API_BASE + '/movies/search?query=' + encodeURIComponent(keyword), {
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            })
    
            if(!response.ok) {
                console.log('No movies found!')
                setNoResults(true);
                return
            }
            // Backend returns from TMDb API
            const data = await response.json()
            setSearchResults(data.results)
        } catch (error) {
            console.log('error: ', error)
        }
        
    }
    const handleAddToWatchList = async (movieId) => {
        const success = await AddToWatchList(movieId)

        if(success) {
            setAddedMovies([...addedMovies, movieId])
        }
    }

    const handleMovieClick = (movieId) => {
        navigate(`/movies/details/${movieId}`)
    }

    return (
        <div className='search-page'>
            <Navbar/>
            
            <div className='search-container-wrapper'>
                <div className='search-container'>
                    <div className='search-hero'>
                        <span className='search-hero-text'></span>
                    </div>
                    <div className='logo-container-search'>
                        <img src='/logo/logo.png' />
                        <h1>Discover and save movies you love</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input 
                            autoFocus
                            type='text' 
                            placeholder='Search for movies...' 
                            aria-label='Search Movies'
                            value = {keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value)
                                setNoResults(false);
                            }}
                            
                        />

                        <div className='button-container-search'>
                            <button type='submit'>Search</button>
                        </div>
                    </form>
                </div>
            </div>

            { noResult && (
                <span className='search-empty'>No results for "{keyword}"</span>
            )}
            {searchResults.length > 0 && (
                <div className='movies-container-search'>
                    <h1>Search results</h1>
                    <div className='movie-grid-search'>
                        {
                            searchResults.map((movie) => (
                                movie.poster_path && (
                                    <div className='movie-details'>
                                        <img
                                            onClick= {() => handleMovieClick(movie.id)}key={movie.id}  
                                            src={movie.poster_path}   
                                        />
                                        <span className='movie-title'>{movie.title}</span>
                                        <button onClick={() => handleAddToWatchList(movie.id)}>
                                            {addedMovies.includes(movie.id)? <FaHeart/> : <FaRegHeart/>}
                                        </button>
                                    </div>
                                )
                            ))
                        }
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default SearchPage
