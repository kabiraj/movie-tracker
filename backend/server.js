import { log } from "console";
import express from "express"
import movieRoutes from './Routes/movieRoutes.js';
import connectToDb from './db.js';
import 'dotenv/config';
import userRoutes from './Routes/userRoutes.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

const startServer = async () => {
    await connectToDb(); // Connect to Database first

    app.listen(3000, ()=>{
        console.log("Server is listening on port 3000");
    });
}

startServer();