import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
    {
        name: String, 
        email: { type: String, match: /^[a-z0-9.!#$%&'*+\-/=?^_`{|]+@[a-z0-9-]+\.[a-z]+(?:\.[a-z]+)*$/gi },
        password: {type: String}
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema);

export default User