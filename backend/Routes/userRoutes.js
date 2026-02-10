import express from 'express';
import User from '../models/User.js';
import authenticateToken from '../middleware/auth.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

//endpoint for user signup
router.post('/signup', async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        if(!fullName || !email || !password) {
            return res.status(400).json({error: "All fields are required"});
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if(existingUser){
            return res.status(400).json({ error: "Email already exists" });
        }
        //const factor to hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.create({ fullName, email: normalizedEmail, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

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


        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if( isPasswordMatch ){
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

router.get("/auth", authenticateToken, (req, res) => {
    res.json({userId: req.userId})
});

export default router;