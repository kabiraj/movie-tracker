import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MoviesListPage from './pages/MoviesListPage'
import SearchPage from './pages/SearchPage'

/**
 * App Component
 * Root component that sets up React Router and defines all routes
 * - BrowserRouter enables client-side routing
 * - Routes define URL paths and their corresponding page components
 * - No route protection here - each page handles its own authentication
 */
function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - no authentication required */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected routes - require authentication token */}
        {/* Each page component checks for token and redirects if missing */}
        <Route path="/movies" element={<MoviesListPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
