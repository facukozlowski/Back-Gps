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
        // 1 - Posadas 2 - Obera
        type: Number,
        required: true
    }
},{
    collection:"MON_User"
})

export default mongoose.model('User', userSchema)