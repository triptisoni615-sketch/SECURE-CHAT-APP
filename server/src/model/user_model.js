import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {

        first_name: {
            type: String,
            required: true,
            trim: true
        },

        last_name: {
            type: String,
            default: "",
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        profile_img: {
            type: String,
            default: ""
        },

        is_online: {
            type: Boolean,
            default: false
        },

        last_seen: {
            type: Date,
            default: null
        },

        is_active: {
            type: Boolean,
            default: true
        },

        is_deleted: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;