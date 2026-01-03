import express from 'express';
import { upload } from '../middleware/upload';
import path from 'path';

const router = express.Router();

/**
 * POST /api/upload
 * 이미지 파일 업로드
 */
router.post('/', upload.single('file'), (req: express.Request, res: express.Response) => {
    if (!req.file) {
        return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }

    res.json({
        success: true,
        file: {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
            path: `/uploads/${req.file.filename}`,
        },
    });
});

/**
 * POST /api/upload/multiple
 * 여러 이미지 파일 업로드
 */
router.post('/multiple', upload.array('files', 20), (req: express.Request, res: express.Response) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }

    const files = (req.files as Express.Multer.File[]).map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: `/uploads/${file.filename}`,
    }));

    res.json({
        success: true,
        files,
        count: files.length,
    });
});

export default router;
