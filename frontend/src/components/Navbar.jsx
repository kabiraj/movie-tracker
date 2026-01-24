import '../styles/Navbar.css'

export default function Navbar() {
    return (
        <nav>
            <div className='nav-container'>
                <div className='nav-logo'>
                    <ul>
                        <li><img src='/logo/logo.png' /></li>
                    </ul>
                    
                </div>
                <div className='nav-bar'>
                    <ul>
                        <li>Profile</li>
                        <li>Search</li>
                        <li>Logout</li>
                    </ul>
                </div>
            </div>
            
        </nav>
    )
}

