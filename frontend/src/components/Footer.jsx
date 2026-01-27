import '../styles/Footer.css'

/**
 * Footer Component
 * Simple footer displayed on all pages
 * - Shows copyright and API credit
 * - Fixed position at bottom of viewport
 */
export default function Footer() {
    return (
        <footer>
            <div className="footer-container">
                <p>&copy; 2025 Movie Tracker</p>
                <p>Powered by TMDB API</p>
            </div>
        </footer>
    )
}

