import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const getStorage = () => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
};

const upload = multer({
    storage: getStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
}).single('avatar'); // Expect field name 'avatar'

export const uploadAvatar = (req: AuthRequest, res: Response) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Construct public URL (assuming server serves static files from uploads)
        // The server is running on port 5000 usually
        const protocol = req.protocol;
        const host = req.get('host');
        const publicUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        try {
            // Update user profile with new avatar URL?
            // The frontend updates the profile via updateProfile, but we can do it here too if needed.
            // For this implementation, we just return the URL and let frontend update usage.
            // Actually `AvatarUpload` updates profile.

            res.json({ publicUrl });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    });
};
