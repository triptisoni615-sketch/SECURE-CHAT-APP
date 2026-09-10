import multer from "multer";

const storage = multer.diskStorage({

    destination: "uploads/",

    filename: (req, file, cb) => {

        const uniqueName =
            `${Date.now()}-${file.originalname}`;

        cb(null, uniqueName);

    }

});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/webp",

        "video/mp4",
        "video/webm",

        "application/pdf"

    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error("Only image, video and PDF files are allowed"),
            false
        );

    }

};

const upload = multer({

    storage,

    limits: {
        fileSize: 50 * 1024 * 1024
    },

    fileFilter

});

export default upload;