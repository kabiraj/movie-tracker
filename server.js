import { log } from "console";
import express from "express"
import movieRoutes from './Routes/movieRoutes.js';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use('/movies', movieRoutes);

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000");
});
