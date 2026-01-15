import { useState } from 'react'

function SignUpPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div>
            <form>
                <label htmlFor="fullName"> Full Name </label>
                <input
                    id= "fullName"
                    value={fullName}
                    placeholder="Full Name"
                    onChange = {(e) => setFullName(e.target.value)}
                />
                <label htmlFor="email"> Email Address </label>
                <input 
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Email address"
                    onChange = {(e) => setEmail(e.target.value)}

                />
                <label htmlFor="password"> Password </label>
                <input 
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange = {(e) => setPassword(e.target.value)}
                />

                <button type="submit">Sign up</button>
            </form>
        </div>
    )
}

export default SignUpPage