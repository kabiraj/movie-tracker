import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'

function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        general: ''
    })
    const navigate = useNavigate()

    // Validates form fields before submission
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

    // Handles form submission and API authentication
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Clear previous errors
        setErrors({ email: '', password: '', general: '' })

        // Validate form before making API call
        if (!validateForm()) {
            return
        }

        try {
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

            // Save token and redirect on successful login
            localStorage.setItem('token', data.passwordToken)
            navigate('/movies')
        } catch {
            // Handle network errors
            setErrors({
                email: '',
                password: '',
                general: 'Network error. Please try again.'
            })
        }
    }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <header className="login-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to your account</p>
                </header>
                <form onSubmit={handleSubmit} noValidate>
                    {errors.general && (
                        <div className="error-message general">{errors.general}</div>
                    )}
                    
                    <label htmlFor="email-input">Email</label>
                    <input 
                        id="email-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && (
                        <span className="error-message">{errors.email}</span>
                    )}
                    
                    <label htmlFor="password-input">Password</label>
                    <input 
                        id="password-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? 'error' : ''}
                    />
                    {errors.password && (
                        <span className="error-message">{errors.password}</span>
                    )}
                    
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage