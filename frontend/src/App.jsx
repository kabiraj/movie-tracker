import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MoviesListPage from './pages/MoviesListPage'
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
    <div className='app-container'>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/movies" element={<MoviesListPage />} />
        </Routes>
        <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App
