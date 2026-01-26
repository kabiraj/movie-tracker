import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MoviesListPage from './pages/MoviesListPage'
import SearchPage from './pages/SearchPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/movies" element={<MoviesListPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App
