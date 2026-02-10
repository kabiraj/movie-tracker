import express from 'express';
import User from '../models/User.js';
import authenticateToken from '../middleware/auth.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// signup: create a new user account
router.post('/signup', async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        if(!fullName || !email || !password) {
            return res.status(400).json({error: "All fields are required"});
        }

        // same email with different caps is treated as one (e.g. Test@mail.com and test@mail.com)
        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if(existingUser){
            return res.status(400).json({ error: "Email already exists" });
        }

        // hash password so we never store the real password in the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.create({fullName, email, password:hashedPassword});
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

// login: check email/password and send back a token if correct
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Email and password are required"});
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if(!user){
            return res.status(404).json({error: "Incorrect username or password"});
        }

        // compare the password they sent with the hashed one we stored
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if( isPasswordMatch ){
            // create a token that includes their user id, frontend will send this on later requests
            const passwordToken = jwt.sign(
                {userId: user._id},
                process.env.JWT_SECRET,
                { expiresIn: "1h"}
            );
            res.status(200).json({message: "Login successful", passwordToken})
        } else {
            res.status(401).json({error: "Incorrect username or password"})
        }

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

// auth: if the token is valid, send back the user id (used by frontend to check if still logged in)
router.get("/auth", authenticateToken, (req, res) => {
    res.json({userId: req.userId})
});

export default router;