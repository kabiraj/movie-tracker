import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'
import Footer from '../components/Footer'

/**
 * LoginPage Component
 * Handles user authentication
 * - Validates email and password format
 * - Sends credentials to backend for authentication
 * - Stores JWT token in localStorage on success
 * - Redirects to search page after successful login
 */
function LoginPage(){
    // Form input state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    // Error state for form validation
    // Separate fields for email, password, and general errors
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    })
    const navigate = useNavigate()

    /**
     * Validates form fields before submission
     * - Email: must contain @ and valid domain
     * - Password: must be at least 8 characters
     * - Returns true if valid, false otherwise
     * - Updates errors state with validation messages
     */
    const validateForm = () => {
        const newErrors = { email: '', password: '', general: '' }
        let isValid = true

        // Email validation
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

        // Password validation
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

    /**
     * Handles form submission and API authentication
     * - Prevents default form submission (page refresh)
     * - Clears previous errors
     * - Validates form fields
     * - Sends credentials to backend
     * - Stores JWT token in localStorage on success
     * - Redirects to search page
     * - Displays error messages for failed login
     */
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Clear previous errors before new validation
        setErrors({ email: '', password: '', general: '' })

        // Validate form before making API call
        // Prevents unnecessary network requests
        if (!validateForm()) {
            return
        }

        try {
            // Send login credentials to backend
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            // Handle server errors (invalid credentials, user not found, etc.)
            if (!response.ok) {
                setErrors({
                    email: '',
                    password: '',
                    general: data.error || 'Login failed'
                })
                return
            }

            // Save JWT token to localStorage
            // Token is used for authenticated API requests
            localStorage.setItem('token', data.passwordToken)
            
            // Redirect to search page after successful login
            navigate('/search')
        } catch {
            // Handle network errors (server down, no internet, etc.)
            setErrors({
                email: '',
                password: '',
                general: 'Network error. Please try again.'
            })
        }
    }

    return (
        <div className='login-page'>
            <div className='logo-container'>
                    <img
                        className="login-logo"
                        src="/logo/logo.png"
                        alt="Movie Tracker logo"
                        />
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
                    {/* Email input field */}
                    <div className="form-field-login">
                        <label htmlFor="email-input">Email</label>
                        <input 
                            id="email-input"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                // Clear email error when user starts typing
                                setErrors((prevErrors) => ({...prevErrors, email:""}))
                            }}
                            className={errors.email ? 'error' : ''}
                        />
                        {/* Display email validation error */}
                        {errors.email && (
                            <span className="error-message">{errors.email}</span>
                        )}
                    </div>
                    
                    {/* Password input field */}
                    <div className="form-field-login">
                        <label htmlFor="password-input">Password</label>
                        <input 
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                // Clear password error when user starts typing
                                setErrors((prevErrors) => ({...prevErrors, password: ''}))
                            }}
                            className={errors.password ? 'error' : ''}
                        />
                        {/* Display password validation error */}
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>
                    <div className="form-field-login"> 
                        <button type="submit">Login</button>
                    </div>

                    
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default LoginPage