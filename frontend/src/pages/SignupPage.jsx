import { useState } from 'react'
import '../styles/SignupPage.css'

function SignUpPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: ''
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

        setErrors(newErrors)
        return isValid

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setErrors({fullName: '',email:'', password: '' })

        if(!validateForm()) {
            return;
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
                        <div className="form-field">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            {errors.fullName && (
                                <span className='error-message'>{errors.fullName}</span>
                            )}
                        </div>
                        <div className="form-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="field-hint">Use at least 8 characters.</span>
                        </div>
                        <div className="form-actions">
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