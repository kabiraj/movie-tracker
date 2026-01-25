import { useState } from 'react'
import '../styles/SearchPage.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


function SearchPage() {
    const [keyword, setKeyword] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('token')
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

            <div className='movies-container'>
                <ul>
                    {
                        searchResults.map((searchResult, index) => (

                            <li 
                                key={`${searchResult.imdbID}- ${index}`}
                                className='movie-item'
                            >
                                    <img    
                                        src ={searchResult.Poster}
                                        onError = {(e) => {
                                            e.target.parentElement.style.display = 'none'
                                        }}
                                    />
                                    <button className='add-to-watch-list'>Add to watchlist</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <Footer />
        </div>
    )
}

export default SearchPage