import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart} from 'react-icons/fa'
import '../styles/SearchPage.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

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
        }
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
            // Backend returns { results: [...] } from TMDb API
            const data = await response.json()
            setSearchResults(data.results)
        } catch (error) {
            console.log('error: ', error)
        }
        
    }

    /**
     * Handles adding a movie to user's watchlist
     * - Sends POST request to backend with movieId (TMDb ID)
     * - Backend fetches full movie details from TMDb and saves to database
     * - Updates addedMovies state to show filled heart icon
     * - Handles both 201 (new movie) and 409 (already exists) as success
     *   because 409 means movie is already in watchlist, so UI should show it as added
     */
    const handleAddToWatchList = async (movieId) => {
        try {
            const response = await fetch('http://localhost:3000/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({movieId: movieId})
            })

            // 201 = Movie successfully added
            if(response.ok) {
                if(response.status === 201) {
                    // Add movieId to addedMovies array to show filled heart
                    setAddedMovies([...addedMovies, movieId])
                }
            } else {
                // 409 = Movie already exists in watchlist
                // Still show as added in UI (filled heart)
                if(response.status === 409) {
                    setAddedMovies([...addedMovies, movieId])
                }
            }
            
        } catch (error) {
            console.log('error: ', error)
        }
        

    }
    return (
        <div className='search-page'>
            <Navbar/>
            
            {/* Search container - centered on page */}
            <div className='search-container-wrapper'>
                <div className='search-container'>
                    <div className='logo-contaienr-search'>
                        <img src='/logo/logo.png' />
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
                                    <div key={movie.id} className='movie-details'>
                                        <img 
                                            src={movie.poster_path}   
                                        />
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