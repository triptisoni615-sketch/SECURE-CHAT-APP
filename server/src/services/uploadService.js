import cloudinary from "../config/cloudinary.js";

// ==============================
// Get File Type
// ==============================

export const getFileType = (mimeType) => {

    if (mimeType.startsWith("image/")) {
        return "image";
    }

    if (mimeType.startsWith("video/")) {
        return "video";
    }

    if (mimeType === "application/pdf") {
        return "pdf";
    }

    return "file";
};

// ==============================
// Upload To Cloudinary
// ==============================

export const uploadToCloudinary = async (
    filePath,
    resourceType = "auto"
) => {

    try {

        const result =
            await cloudinary.uploader.upload(
                filePath,
                {
                    resource_type: resourceType
                }
            );

        return {
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type
        };

    } catch (error) {

        console.error(
            "Cloudinary upload error:",
            error.message
        );

        throw error;
    }
};