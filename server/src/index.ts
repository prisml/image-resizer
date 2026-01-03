import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/api/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'Server is running' });
});

// 에러 핸들링
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
