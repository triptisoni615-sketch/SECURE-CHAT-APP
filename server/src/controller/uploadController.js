import fs from "fs";

import {
    uploadToCloudinary
} from "../services/uploadService.js";

export const uploadFile = async (req, res, next) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please select a file"
            });

        }

        const result = await uploadToCloudinary(
            req.file.path,
            "auto"
        );

        // Delete local file after Cloudinary upload
        fs.unlinkSync(req.file.path);

        res.status(201).json({

            success: true,

            message: "File uploaded successfully",

            file: {
                url: result.url,
                public_id: result.public_id,
                resource_type: result.resource_type,
                original_name: req.file.originalname,
                size: req.file.size,
                mime_type: req.file.mimetype
            }

        });

    } catch (error) {

        next(error);

    }
};