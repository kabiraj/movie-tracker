import express from 'express';
import User from '../models/User.js';

const router = express.Router();

//endpoint for user signup
router.post('/signup', async (req, res) => {
    try {
        const {username, email, password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).send("Email alreayd exist");
        }

        const user = await User.create({username, email, password});
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Email and password are required"});
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        if( user.password === password){
            res.status(200).json({message: "Login successful"})
        } else {
            res.status(401).json({error: "login credintials does not match."})
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;