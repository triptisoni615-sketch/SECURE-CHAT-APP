import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {

        uploaded_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        original_name: {
            type: String,
            required: true
        },

        file_name: {
            type: String,
            required: true
        },

        file_url: {
            type: String,
            required: true
        },

        mime_type: {
            type: String,
            required: true
        },

        size: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: true
    }
);

const File = mongoose.model("File", fileSchema);

export default File;