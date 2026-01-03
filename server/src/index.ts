import express from 'express';
import cors from 'cors';
import path from 'path';
import uploadRoutes from './routes/upload.js';
import resizeRoutes from './routes/resize.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = 5000;

// 미들웨어
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 라우트
app.use('/api/upload', uploadRoutes);
app.use('/api/resize', resizeRoutes);

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
