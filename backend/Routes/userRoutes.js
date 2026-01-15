import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

//endpoint for user signup
router.post('/signup', async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        if(!fullName || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).send("Email alreayd exist");
        }
        //const factor to hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({fullName, email, password:hashedPassword});
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
        res.status(500).json({error: error.message});
    }
});

export default router;