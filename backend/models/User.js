import mongoose from 'mongoose';

// one user: name, email, and hashed password. email must be unique.
const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    email: {
        type : String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

export default User;