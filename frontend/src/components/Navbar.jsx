import '../styles/Navbar.css'

export default function Navbar() {
    return (
        <nav>
            <div className='nav-container'>
                <div className='nav-logo'>
                    <img src='/logo/logo_navbar.png' />
                </div>
                <div className='nav-bar'>
                    <ul>
                        <li>Home</li>
                        <li>Profile</li>
                        <li>Search</li>
                        <li>Logout</li>
                    </ul>
                </div>
            </div>
            
        </nav>
    )
}

