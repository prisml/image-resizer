import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import uploadRoutes from './routes/upload';
import resizeRoutes from './routes/resize';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (업로드된 이미지)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 라우트
app.use('/api/upload', uploadRoutes);
app.use('/api/resize', resizeRoutes);

// 기본 헬스 체크 라우트
app.get('/api/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'Server is running' });
});

// 404 핸들러
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Not Found' });
});

// 에러 핸들링 미들웨어 (마지막에 위치해야 함)
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
