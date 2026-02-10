import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate} from 'react-router-dom'
import { FaUser, FaSearch, FaSignOutAlt } from 'react-icons/fa'

import '../styles/Navbar.css'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <nav className={isScrolled ? 'scrolled' : ''}>
            <div className='nav-container'>
                <div className='nav-logo'>
                    <img src='/logo/logo.png' />
                </div>
                <div className='nav-bar'>
                    <ul>
                        <li>
                            <NavLink
                                to='/movies'
                                aria-label='Profile'
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                <FaUser className='nav-icon' />
                                <span className='nav-label'>Profile</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to='/search'
                                aria-label='Search'
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                <FaSearch className='nav-icon' />
                                <span className='nav-label'>Search</span>
                            </NavLink>
                        </li>
                        <li onClick={handleLogout}>
                            <NavLink
                                to='/login'
                                aria-label='Logout'
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                <FaSignOutAlt className='nav-icon' />
                                <span className='nav-label'>Logout</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
