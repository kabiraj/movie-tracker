import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import MovieDetailsPage from '../src/pages/MovieDetailsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MoviesListPage from './pages/MoviesListPage'
import SearchPage from './pages/SearchPage'

// all the routes. each page checks on its own if the user is logged in (except login/signup).
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/movies" element={<MoviesListPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies/details/:movieId" element={<MovieDetailsPage/>} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App
