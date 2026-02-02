import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate} from 'react-router-dom'

import '../styles/Navbar.css'

/**
 * Navbar Component
 * Fixed navigation bar with scroll-triggered background change
 * - Starts transparent/minimal, adds glassmorphism effect when scrolled
 * - Contains logo, navigation links, and logout functionality
 * - Fixed position so it stays at top while scrolling
 */
export default function Navbar() {
    // State to track if user has scrolled past threshold
    // Used to apply 'scrolled' CSS class for background change
    const [isScrolled, setIsScrolled] = useState(false)
    const navigate = useNavigate()

    /**
     * useEffect sets up scroll event listener
     * - Listens for window scroll events
     * - Updates isScrolled state when scroll position > 50px
     * - Returns cleanup function to remove listener on unmount
     * - Empty dependency array means this runs once on mount only
     */
    useEffect(() => {
        const handleScroll = () => {
            // Add glassmorphism background when scrolled past 50px
            if (window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        // Add scroll listener
        window.addEventListener('scroll', handleScroll)
        
        // Cleanup: remove listener when component unmounts
        // Prevents memory leaks and errors if component is removed
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    /**
     * Handles user logout
     * - Removes authentication token from localStorage
     * - Redirects to login page
     */
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    return (
        // Conditionally apply 'scrolled' class for CSS styling when user scrolls
        <nav className={isScrolled ? 'scrolled' : ''}>
            <div className='nav-container'>
                <div className='nav-logo'>
                    <img src='/logo/logo.png '/>
                </div>
                <div className='nav-bar'>
                    <ul>
                        <li><Link to='/movies'>Profile</Link></li>
                        <li><Link to='/search'>Search</Link></li>
                        <li onClick={handleLogout}><Link to='/login'>Logout</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

