import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import Archiver from 'archiver';
import uploadRoutes from './routes/upload.js';
import resizeRoutes from './routes/resize.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = 5000;

// 미들웨어
app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 라우트
app.use('/api/upload', uploadRoutes);
app.use('/api/resize', resizeRoutes);

// 파일 다운로드 엔드포인트
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const downloadName = (req.query.downloadName as string) || filename;
    const filepath = path.join(process.cwd(), 'uploads', filename);

    res.download(filepath, downloadName, (err: any) => {
        if (err) {
            res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
        }
    });
});

// 여러 파일 zip 다운로드 엔드포인트
app.post('/api/download-zip', (req, res) => {
    const { files } = req.body as { files: Array<{ filename: string; downloadName: string }> };

    if (!files || files.length === 0) {
        return res.status(400).json({ error: '다운로드할 파일이 없습니다.' });
    }

    // 응답 헤더 설정
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="resized-images.zip"');

    // archiver 생성
    const archive = Archiver('zip', {
        zlib: { level: 9 }, // 최대 압축
    });

    // 에러 핸들링
    archive.on('error', (err: any) => {
        console.error('Archive error:', err);
        res.status(500).json({ error: '압축 중 오류가 발생했습니다.' });
    });

    // 스트림 파이프
    archive.pipe(res);

    // 파일 추가
    for (const file of files) {
        const filepath = path.join(process.cwd(), 'uploads', file.filename);
        if (fs.existsSync(filepath)) {
            archive.file(filepath, { name: file.downloadName });
        }
    }

    // 압축 완료
    archive.finalize();
});

// 헬스 체크
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// 에러 핸들링
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
