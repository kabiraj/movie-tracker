import { useState } from 'react'
import '../styles/SignupPage.css'

function SignUpPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        general: ''
    })

    function validateForm() {
        const newErrors = {
            fullName: '',
            email: '',
            password: ''
        }
        let isValid = true;

        if(!fullName.trim()){
            newErrors.fullName = 'Full name is required'
            isValid = false;
        }

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
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = 'Password must include an uppercase letter'
            isValid = false
        } else if (!/[a-z]/.test(password)) {
            newErrors.password = 'Password must include a lowercase letter'
            isValid = false
        } else if (!/\d/.test(password)) {
            newErrors.password = 'Password must include a number'
            isValid = false
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            newErrors.password = 'Password must include a special character'
            isValid = false
        }

        setErrors(newErrors)
        return isValid

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrors({fullName: '',email:'', password: '' })

        if(!validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/users/signup', {
                method: 'POST',
                headers: {'Content-type' : 'application/json'},
                body: JSON.stringify({fullName, email, password})
            })

            const data = await response.json();

            if(!response.ok) {
                setErrors({...errors, general:  data.error || data.message || ' Server error'})
                return
            }
        } catch {
            setErrors({...errors, general: 'Network error. Try again.'})
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-wrapper">
                <div className="signup-container">
                    <form onSubmit ={handleSubmit} noValidate>
                        <div className="signup-header">
                            <h1 className="signup-title">Create your account</h1>
                            <p className="signup-subtitle">
                                Track favorites, build watchlists, and enjoy
                            </p>
                        </div>
                        {errors.general && (
                            <span className='error-message-server'>! {errors.general}</span>
                        )}
                        <div className="form-field-signup">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value)
                                        setFullName(e.target.value)
                                        setErrors((prevError) => ({...prevError, fullName: ''}))
                                    }
                                }
                            />
                            {errors.fullName && (
                                <span className='error-message'>{errors.fullName}</span>
                            )}
                        </div>
                        <div className="form-field-signup">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setErrors((prevErrors) => ({...prevErrors, email:'', general:''}))
                                }}
                            />
                            {errors.email && (
                                <span className='error-message'>{errors.email}</span>
                            )}
                        </div>
                        <div className="form-field-signup">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors((prevErrors) => ({...prevErrors, password:''}))
                                }}
                            />
                            {errors.password && (
                                <span className='error-message'>{errors.password}</span>
                            )}
        
                        </div>
                        <div className="form-field-signup">
                            <button type="submit">Sign up</button>
                        </div>
                    </form>
                </div>

                <div className="signup-photo-section">

                </div>
            </div>
        </div>
    )
}

export default SignUpPage