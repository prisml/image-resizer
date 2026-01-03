export const errorHandler = (err: any, req: any, res: any, next: any) => {
    console.error('Error:', err);

    // multer 에러 처리
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '파일이 너무 큽니다. 50MB 이하의 파일만 업로드할 수 있습니다.' });
        }
        return res.status(400).json({ error: `파일 업로드 에러: ${err.message}` });
    }

    // 커스텀 에러 처리
    if (err.message.includes('지원하지 않는 파일 형식')) {
        return res.status(400).json({ error: err.message });
    }

    // 기본 에러 처리
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
};
