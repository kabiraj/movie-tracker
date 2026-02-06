import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart} from 'react-icons/fa'
import '../styles/SearchPage.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { AddToWatchList } from '../utils/AddToWatchList'

/**
 * SearchPage Component
 * Main page where users search for movies and add them to their watchlist
 * - Displays search bar with logo
 * - Shows search results in a grid layout
 * - Allows users to add movies to watchlist via heart icon
 */
function SearchPage() {
    // State for search input field
    const [keyword, setKeyword] = useState('')
    
    // State to store search results from TMDb API
    const [searchResults, setSearchResults] = useState([])
    
    // State to track which movies have been added to watchlist
    // Used to show filled heart (FaHeart) vs outline heart (FaRegHeart)
    const [addedMovies, setAddedMovies] = useState([])
    
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    // Route protection: Redirect to login if no token exists
    // Runs on component mount and when token/navigate changes
    useEffect(() => {
        if(!token) {
            navigate('/login')
            return
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`http://localhost:3000/users/auth`, {
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
    
    // Early return to prevent rendering protected content without token
    if (!token) {
        return null
    }

    /**
     * Handles search form submission
     * - Prevents default form behavior (page refresh)
     * - Clears previous search results
     * - Validates that keyword is not empty
     * - Fetches movies from backend search endpoint
     * - Updates searchResults state with TMDb API response
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        // Clear previous results for new search
        setSearchResults([])

        // Don't search if input is empty or only whitespace
        if(!keyword.trim()){
            return
        }

        try {
            // Call backend search endpoint with query parameter
            const response = await fetch('http://localhost:3000/movies/search?query=' + keyword, {
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            })
    
            if(!response.ok) {
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
                            type='text' 
                            placeholder='Search for movies...' 
                            aria-label='Search Movies'
                            value = {keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />

                        <div className='button-container-search'>
                            <button type='submit'>Search</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Conditionally render search results only when results exist */}
            {searchResults.length > 0 && (
                <div className='movies-container-search'>
                    <h1>Search results</h1>
                    <div className='movie-grid-search'>
                        {
                            searchResults.map((movie) => (
                                // Only render movies that have a poster image
                                movie.poster_path && (
                                    <div className='movie-details'>
                                        <img
                                            onClick= {() => handleMovieClick(movie.id)}key={movie.id}  
                                            src={movie.poster_path}   
                                        />
                                        <span className='movie-title'>{movie.title}</span>
                                        {/* Heart button: filled (FaHeart) if movie is in addedMovies array, outline (FaRegHeart) otherwise */}
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
