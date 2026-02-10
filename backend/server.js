import express from "express"
import movieRoutes from './Routes/movieRoutes.js';
import connectToDb from './db.js';
import 'dotenv/config';
import userRoutes from './Routes/userRoutes.js';
import cors from 'cors';

// quit early if we're missing env vars so we don't fail later in a weird way
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'TMDB_API_KEY'];
const missing = requiredEnvVars.filter(key => !process.env[key]);
if (missing.length) {
    console.error('Missing required env vars:', missing.join(', '));
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// in production you set FRONTEND_URL so only your frontend can call this api
app.use(cors(FRONTEND_URL ? { origin: FRONTEND_URL } : {}));
app.use(express.json());
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

const startServer = async () => {
    await connectToDb();
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

startServer();