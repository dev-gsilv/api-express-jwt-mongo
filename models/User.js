import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String, 
        email: { type: String, match: /^[a-z0-9.!#$%&'*+\-/=?^_`{|]+@[a-z0-9-]+\.[a-z]+(?:\.[a-z]+)*$/gi },
        password: {type: String},
        changePasswordAttemps: 
            {
                type: Number,
                default: 0,
                expireAfterSeconds: 3600
            }
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema);

export default User