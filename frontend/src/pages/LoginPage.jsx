import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'

function LoginPage(){
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password})
        })

        const data = await response.json()
        localStorage.setItem('token', data.passwordToken)

        navigate('/movies')
    }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <header className='login-header'>
                    <h1>Welcome back</h1>
                    <p>Sign in to your account</p>
                </header>
                <form onSubmit = {handleSubmit}>
                    <label htmlFor="email-input">Email</label>
                    <input 
                        id = "email-input"
                        type = 'email'
                        placeholder = 'Email'
                        value = {email}
                        onChange = { (e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password-input">Password</label>
                    <input 
                        id = "password-input"
                        type = 'password'
                        placeholder = 'Password'
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                    />

                    <button type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage