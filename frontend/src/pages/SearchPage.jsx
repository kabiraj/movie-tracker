import { useEffect, useState } from 'react'
import '../styles/SearchPage.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'


function SearchPage() {
    const [keyword, setKeyword] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if(!token) {
            navigate('/login')
        }
    }, [token, navigate])
    
    // if (!token) {
    //     return null
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSearchResults([])

        if(!keyword.trim()){
            return
        }

        try {
            const response = await fetch('http://localhost:3000/movies/search?query=' + keyword, {
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            })
    
            if(!response.ok) {
                return
            }
            const data = await response.json()
            setSearchResults(data.Search)
        } catch (error) {
            console.log('error: ', error)
        }
        
    }

    return (
        <div className='search-page'>
            <Navbar/>
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

            
                {searchResults.length > 0 && (
                    <div className='movies-container-search'>
                        <h1>Search results</h1>
                        <div className='movie-grid-search'>
                            {
                                searchResults.map((movie) => (
                                    <div key={movie._id}>
                                        <img 
                                            src={movie.Poster}
                                                onError={(e) => {
                                                e.target.parentElement.style.display='none'
                                            }}
                                        />
                                    </div>
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