import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const uploadDir = path.join(process.cwd(), 'uploads');

export interface ResizeRequest {
    filename: string;
    width?: number;
    height?: number;
    maintainAspectRatio: boolean;
}

/**
 * POST /api/resize
 * 이미지 리사이징
 */
router.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { filename, width, height, maintainAspectRatio } = req.body as ResizeRequest;

        if (!filename) {
            return res.status(400).json({ error: '파일명이 필요합니다.' });
        }

        const inputPath = path.join(uploadDir, filename);

        // 파일 존재 여부 확인
        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
        }

        // width와 height 중 하나도 입력되지 않은 경우
        if (!width && !height) {
            return res.status(400).json({ error: '너비 또는 높이가 필요합니다.' });
        }

        let resizeOptions: any = {
            withoutEnlargement: true, // 원본보다 크게 확대하지 않음
        };

        if (maintainAspectRatio) {
            // 한쪽만 지정하면 비율에 맞게 다른 쪽 자동 계산
            resizeOptions.width = width || undefined;
            resizeOptions.height = height || undefined;
        } else {
            // 비율 유지 안 함
            if (width && height) {
                resizeOptions.width = width;
                resizeOptions.height = height;
                resizeOptions.fit = 'fill'; // 지정된 크기에 맞춤
            } else if (width) {
                resizeOptions.width = width;
            } else if (height) {
                resizeOptions.height = height;
            }
        }

        // 리사이징된 파일명
        const ext = path.extname(filename);
        const nameWithoutExt = path.basename(filename, ext);
        const resizedFilename = `${nameWithoutExt}-resized-${Date.now()}${ext}`;
        const outputPath = path.join(uploadDir, resizedFilename);

        // Sharp를 이용한 이미지 리사이징
        await sharp(inputPath)
            .resize(resizeOptions.width, resizeOptions.height, {
                fit: resizeOptions.fit || 'inside',
                withoutEnlargement: resizeOptions.withoutEnlargement,
            })
            .toFile(outputPath);

        res.json({
            success: true,
            file: {
                originalFilename: filename,
                resizedFilename: resizedFilename,
                path: `/uploads/${resizedFilename}`,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
