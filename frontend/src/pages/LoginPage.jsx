import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'
import { Link } from 'react-router-dom'
import { API_BASE } from '../config'

// login form. we validate email and password then call the backend. if it succeeds we save the token and send them to search.
function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    })
    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors = { email: '', password: '', general: '' }
        let isValid = true

        if (!email.trim()) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!email.includes('@')) {
            newErrors.email = 'Email must contain @'
            isValid = false
        } else {
            const domain = email.split('@')[1]
            if (!domain || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
                newErrors.email = 'Email must have a valid domain'
                isValid = false
            }
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({ email: '', password: '', general: '' })

        if (!validateForm()) {
            return
        }

        try {
            const response = await fetch(API_BASE + '/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                setErrors({
                    email: '',
                    password: '',
                    general: data.error || 'Login failed'
                })
                return
            }

            localStorage.setItem('token', data.passwordToken)
            navigate('/search')
        } catch {
            setErrors({
                email: '',
                password: '',
                general: 'Network error. Please try again.'
            })
        }
    }

    return (
        <div className='login-page'>
            <div className='login-logo-container'>
                    <img
                        className="login-logo"
                        src="/logo/logo.png"
                        alt="Movie Tracker logo"
                        />
            </div>
            <div className='login-background-section'>
                <div className='login-poster-grid'>
                    <img src="/movieposter/1.jpg" alt="Movie poster 1" />
                    <img src="/movieposter/2.jpg" alt="Movie poster 2" />
                    <img src="/movieposter/3.jpg" alt="Movie poster 3" />
                    <img src="/movieposter/4.jpg" alt="Movie poster 4" />
                </div>
            </div>
            <div className='login-container'>
                <header className="login-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to your account</p>
                </header>
                <form onSubmit={handleSubmit} noValidate>
                    {errors.general && (
                        <div className="error-message general">{errors.general}</div>
                    )}
                    <div className="form-field-login">
                        <label htmlFor="email-input">Email</label>
                        <input 
                            id="email-input"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setErrors((prevErrors) => ({...prevErrors, email:""}))
                            }}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email}</span>
                        )}
                    </div>
                    
                    <div className="form-field-login">
                        <label htmlFor="password-input">Password</label>
                        <input 
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setErrors((prevErrors) => ({...prevErrors, password: ''}))
                            }}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>
                    <div className="form-field-login"> 
                        <button type="submit">Login</button>
                    </div>
                    
                    <div class='signup-option-container'>
                        <p>Don't have an account?</p>
                        <Link to="/signup" className="signup-link">Signup</Link>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default LoginPage