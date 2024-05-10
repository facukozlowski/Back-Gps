import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    city: {
        // Posadas - Obera
        type: String,
        required: true
    }
},{
    collection:"MON_User"
})

export default mongoose.model('User', userSchema)