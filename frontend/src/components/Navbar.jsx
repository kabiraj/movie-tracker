import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate} from 'react-router-dom'

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

