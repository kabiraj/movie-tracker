import mongoose from 'mongoose';
import 'dotenv/config';

// connect to mongo using the connection string in .env. if it fails we exit so the server doesn't run without a database.
const connectToDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectToDb;