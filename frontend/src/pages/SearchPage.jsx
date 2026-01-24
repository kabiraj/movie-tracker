import { useState } from 'react'
import '../styles/SearchPage.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


function SearchPage() {
    const [keyword, setKeyword] = useState('')
    

    return (
        <div className='search-page'>
            <Navbar/>
            <div className='search-container-wrapper'>
                <div className='search-container'>
                    <div className='logo-contaienr-search'>
                        <img src='/logo/logo.png' />
                    </div>
                    <form>
                        <input type='text' placeholder='Search for movies...' aria-label='Search Movies'></input>
                        <div className='button-container-search'>
                            <button type='submit'>Search</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default SearchPage