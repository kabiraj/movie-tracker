import { useState } from 'react'

function LoginPage(){
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password})
        })

        const data = await response.json()
        console.log(data)
    }

    return (
        <div className='login-page'>
            <div className='login-container'>
                <form onSubmit = {handleSubmit}>
                    <input 
                        type = 'email'
                        placeholder = 'Email'
                        value = {email}
                        onChange = { (e) => setEmail(e.target.value)}
                    />

                    <input 
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

export default LoginPage;