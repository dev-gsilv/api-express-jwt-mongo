import mongoose from "mongoose";

export const expirationSchema = new mongoose.Schema(
    {
        changePasswordAttemps: 
        {
            counter: {
                type: Number,
                default: 0,                    
            },
            tracker: {
                type: Date,
                default: Date.now,
                expireAfterSeconds: 60
            }
        },
        user_pk: { 
            type: mongoose.ObjectId, 
            ref: 'User'
        }
    }
)
export const Expiration = mongoose.model(Expiration, expirationSchema)

export default Expiration